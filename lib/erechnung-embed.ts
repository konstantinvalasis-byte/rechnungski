// ZUGFeRD XML in PDF einbetten via pdf-lib
// Bettet die XML-Datei als Anhang ein (AFRelationship: Alternative)

import { PDFDocument, PDFName, PDFString, PDFArray, PDFDict } from "pdf-lib";
import type { ERechnungProfil } from "@/lib/erechnung-xml";

const DATEINAME: Record<ERechnungProfil, string> = {
  zugferd: "factur-x.xml",
  xrechnung: "xrechnung.xml",
};

export async function betteXmlEin(
  pdfBuffer: Buffer,
  xmlString: string,
  profil: ERechnungProfil
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const xmlBytes = new TextEncoder().encode(xmlString);
  const dateiname = DATEINAME[profil];
  const ctx = pdfDoc.context;

  // Embedded File Stream
  const embeddedFileStream = ctx.flateStream(xmlBytes, {
    Type: "EmbeddedFile",
    Subtype: "application/xml",
    Params: ctx.obj({ Size: xmlBytes.length }),
  });
  const embeddedFileRef = ctx.register(embeddedFileStream);

  // Filespec Dictionary
  const filespecDict = ctx.obj({
    Type: "Filespec",
    F: PDFString.of(dateiname),
    UF: PDFString.of(dateiname),
    EF: ctx.obj({ F: embeddedFileRef, UF: embeddedFileRef }),
    AFRelationship: PDFName.of("Alternative"),
    Desc: PDFString.of(profil === "zugferd" ? "ZUGFeRD XML Rechnung" : "XRechnung XML"),
  });
  const filespecRef = ctx.register(filespecDict);

  // Namen-Eintrag für EmbeddedFiles im Catalog
  const catalog = pdfDoc.catalog;

  let namesDict = catalog.lookupMaybe(PDFName.of("Names"), PDFDict);
  if (!namesDict) {
    namesDict = ctx.obj({}) as PDFDict;
    catalog.set(PDFName.of("Names"), namesDict);
  }

  const nameArray = ctx.obj([PDFString.of(dateiname), filespecRef]) as PDFArray;
  const embeddedFilesDict = ctx.obj({ Names: nameArray });
  namesDict.set(PDFName.of("EmbeddedFiles"), embeddedFilesDict);

  // AF-Array (Associated Files) im Catalog
  const afArray = ctx.obj([filespecRef]) as PDFArray;
  catalog.set(PDFName.of("AF"), afArray);

  const result = await pdfDoc.save();
  return Buffer.from(result);
}
