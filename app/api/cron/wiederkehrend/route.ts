import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import * as Sentry from '@sentry/nextjs'

// ═══════════════════════════════════════════════════════════
// CRON: Wiederkehrende Rechnungen automatisch erstellen
// GET /api/cron/wiederkehrend
//
// Wird täglich von Vercel Cron aufgerufen.
// Erstellt Rechnungen für alle fälligen Vorlagen und
// berechnet das nächste Fälligkeitsdatum.
// ═══════════════════════════════════════════════════════════

function naechstesFaelligkeitsdatum(aktuellesDatum: string, interval: string): string {
  const d = new Date(aktuellesDatum)
  switch (interval) {
    case 'monatlich': d.setMonth(d.getMonth() + 1); break
    case 'quartal':   d.setMonth(d.getMonth() + 3); break
    case 'jaehrlich': d.setFullYear(d.getFullYear() + 1); break
  }
  return d.toISOString().split('T')[0]
}

function faelligAmBerechnen(datum: string, zahlungsziel: number): string {
  const d = new Date(datum)
  d.setDate(d.getDate() + (zahlungsziel || 14))
  return d.toISOString().split('T')[0]
}

export async function GET(req: NextRequest) {
  // Cron-Secret prüfen (Vercel setzt den Header automatisch)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const sb = createSupabaseAdmin()
  const heute = new Date().toISOString().split('T')[0]

  // Alle aktiven Vorlagen laden die heute oder früher fällig sind
  const { data: faellige, error } = await sb
    .from('wiederkehrend')
    .select('*')
    .eq('aktiv', true)
    .lte('next_due', heute)

  if (error) {
    Sentry.captureException(new Error(`Cron wiederkehrend: Fehler beim Laden: ${error.message}`))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!faellige || faellige.length === 0) {
    return NextResponse.json({ erstellt: 0, message: 'Keine fälligen Vorlagen' })
  }

  let erstellt = 0
  const fehler: string[] = []

  for (const vorlage of faellige) {
    try {
      const jahr = new Date(heute).getFullYear()

      // Nächste Sequenznummer für diesen Nutzer im aktuellen Jahr
      const { data: seqData } = await sb
        .from('rechnungen')
        .select('nummer_seq')
        .eq('user_id', vorlage.user_id)
        .eq('nummer_jahr', jahr)
        .order('nummer_seq', { ascending: false })
        .limit(1)

      const naechsteSeq = seqData && seqData.length > 0 ? (seqData[0].nummer_seq ?? 0) + 1 : 1
      const rechnungNummer = `RE-${jahr}-${String(naechsteSeq).padStart(4, '0')}`
      const faelligAm = faelligAmBerechnen(heute, vorlage.zahlungsziel || 14)

      // Rechnung erstellen
      const { data: neueRechnung, error: insertError } = await sb
        .from('rechnungen')
        .insert({
          user_id: vorlage.user_id,
          kunde_id: vorlage.kunde_id || null,
          nummer: rechnungNummer,
          nummer_jahr: jahr,
          nummer_seq: naechsteSeq,
          typ: 'rechnung',
          status: 'entwurf',
          rechnungsdatum: heute,
          faellig_am: faelligAm,
          kunde_name: vorlage.kunde_name,
          kunde_adresse: vorlage.kunde_adresse,
          kunde_email: vorlage.kunde_email,
          gesamt_netto: vorlage.netto,
          gesamt_mwst: vorlage.mwst_betrag,
          gesamt_brutto: vorlage.gesamt,
          zahlungsziel: vorlage.zahlungsziel,
          fusszeile: vorlage.notiz,
          gewerk: vorlage.gewerk,
          rabatt: vorlage.rabatt,
        })
        .select()
        .single()

      if (insertError) throw new Error(insertError.message)

      // Positionen einfügen (in wiederkehrend als JSONB gespeichert)
      const positionen = vorlage.positionen as Array<{
        id: string
        beschreibung: string
        einheit: string
        menge: number
        einzelpreis?: number
        preis?: number
        mwst_satz?: number
        mwst?: number
        typ: string
      }>

      if (positionen?.length > 0) {
        await sb.from('rechnungspositionen').insert(
          positionen.map((p, i) => ({
            rechnung_id: neueRechnung.id,
            position: i + 1,
            beschreibung: p.beschreibung,
            einheit: p.einheit,
            menge: p.menge,
            einzelpreis: p.einzelpreis ?? p.preis ?? 0,
            mwst_satz: p.mwst_satz ?? p.mwst ?? 19,
            typ: p.typ,
          }))
        )
      }

      // next_due aktualisieren
      const neuesNextDue = naechstesFaelligkeitsdatum(vorlage.next_due ?? heute, vorlage.interval ?? 'monatlich')
      await sb
        .from('wiederkehrend')
        .update({ next_due: neuesNextDue })
        .eq('id', vorlage.id)

      erstellt++
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      Sentry.captureException(err, { extra: { vorlageId: vorlage.id } })
      fehler.push(`${vorlage.id}: ${msg}`)
    }
  }

  // BE-06: Dead-Man-Switch — Ping an Cronitor/Betteruptime nach erfolgreicher Ausführung
  // Monitoring-URL in .env.local setzen: CRON_HEALTHCHECK_URL=https://cronitor.link/p/<id>/wiederkehrend
  const healthcheckUrl = process.env.CRON_HEALTHCHECK_URL
  if (healthcheckUrl) {
    try {
      await fetch(healthcheckUrl)
    } catch {
      // Healthcheck-Fehler nicht kritisch — Cron-Job war erfolgreich
    }
  }

  return NextResponse.json({
    erstellt,
    fehler: fehler.length > 0 ? fehler : undefined,
    datum: heute,
  })
}
