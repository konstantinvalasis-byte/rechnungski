import { createSupabaseBrowser } from './supabase-browser'

// ═══════════════════════════════════════════════════════════
// TYPEN (gespiegelt vom Dashboard)
// ═══════════════════════════════════════════════════════════
export interface Firma {
  name: string
  inhaber?: string
  strasse?: string
  plz?: string
  ort?: string
  telefon?: string
  email?: string
  web?: string
  steuernr?: string
  ustid?: string
  bankName?: string
  iban?: string
  bic?: string
  gewerk?: string
  logo?: string
  kleinunternehmer?: boolean
}

export interface Kunde {
  id: string
  name: string
  strasse?: string
  plz?: string
  ort?: string
  email?: string
  telefon?: string
}

export interface Position {
  id: string
  beschreibung: string
  einheit: string
  menge: number
  preis: number
  mwst: number
  typ?: 'arbeit' | 'material'
}

export interface Rechnung {
  id: string
  nummer: string
  typ?: string
  datum: string
  faelligDatum: string
  kundeId: string
  kundeName: string
  kundeAdresse: string
  kundeEmail: string
  positionen: Position[]
  netto: number
  mwst: number
  gesamt: number
  zahlungsziel: number
  notiz: string
  status: string
  gewerk: string
  rabatt: number
  zeitraumVon: string
  zeitraumBis: string
  mahnstufe?: number
}

export interface FavoritItem {
  id: string
  beschreibung: string
  einheit: string
  preis: number
  mwst?: number
  typ?: 'arbeit' | 'material'
}

export interface WiederkehrendItem {
  id: string
  kundeId: string
  kundeName: string
  kundeAdresse: string
  kundeEmail: string
  positionen: Position[]
  netto: number
  mwst: number
  gesamt: number
  zahlungsziel: number
  notiz: string
  gewerk: string
  rabatt: number
  interval: 'monatlich' | 'quartal' | 'jaehrlich'
  nextDue: string
  aktiv: boolean
  name?: string
}

// ═══════════════════════════════════════════════════════════
// PROFIL / FIRMA
// ═══════════════════════════════════════════════════════════
export async function ladeProfil(): Promise<Firma | null> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null

  const { data } = await sb
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!data) return null

  return {
    name: data.firma || '',
    inhaber: data.inhaber || '',
    strasse: data.strasse || '',
    plz: data.plz || '',
    ort: data.ort || '',
    telefon: data.telefon || '',
    email: data.email || '',
    web: data.web || '',
    steuernr: data.steuernummer || '',
    ustid: data.ust_id || '',
    bankName: data.bank || '',
    iban: data.iban || '',
    bic: data.bic || '',
    gewerk: data.gewerk || '',
    logo: data.logo || '',
    kleinunternehmer: data.kleinunternehmer || false,
  }
}

export async function speichereProfil(firma: Firma): Promise<void> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return

  await sb.from('profiles').upsert({
    id: user.id,
    email: user.email,
    firma: firma.name,
    inhaber: firma.inhaber,
    strasse: firma.strasse,
    plz: firma.plz,
    ort: firma.ort,
    telefon: firma.telefon,
    web: firma.web,
    steuernummer: firma.steuernr,
    ust_id: firma.ustid,
    bank: firma.bankName,
    iban: firma.iban,
    bic: firma.bic,
    gewerk: firma.gewerk,
    logo: firma.logo,
    kleinunternehmer: firma.kleinunternehmer,
    aktualisiert_am: new Date().toISOString(),
  })
}

// ═══════════════════════════════════════════════════════════
// KUNDEN
// ═══════════════════════════════════════════════════════════
export async function ladeKunden(): Promise<Kunde[]> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return []

  const { data } = await sb
    .from('kunden')
    .select('*')
    .eq('user_id', user.id)
    .order('erstellt_am', { ascending: false })

  return (data || []).map(k => ({
    id: k.id,
    name: k.name || [k.firma, k.vorname, k.nachname].filter(Boolean).join(' ') || 'Unbekannt',
    strasse: k.strasse || '',
    plz: k.plz || '',
    ort: k.ort || '',
    email: k.email || '',
    telefon: k.telefon || '',
  }))
}

export async function kundeHinzufuegen(kunde: Omit<Kunde, 'id'>): Promise<Kunde> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Nicht eingeloggt')

  const { data, error } = await sb
    .from('kunden')
    .insert({
      user_id: user.id,
      name: kunde.name,
      strasse: kunde.strasse,
      plz: kunde.plz,
      ort: kunde.ort,
      email: kunde.email,
      telefon: kunde.telefon,
    })
    .select()
    .single()

  if (error) throw error
  return { id: data.id, name: data.name || kunde.name, strasse: data.strasse ?? undefined, plz: data.plz ?? undefined, ort: data.ort ?? undefined, email: data.email ?? undefined, telefon: data.telefon ?? undefined }
}

export async function kundeAktualisieren(id: string, updates: Partial<Kunde>): Promise<void> {
  const sb = createSupabaseBrowser()
  const { error } = await sb.from('kunden').update({
    name: updates.name,
    strasse: updates.strasse,
    plz: updates.plz,
    ort: updates.ort,
    email: updates.email,
    telefon: updates.telefon,
  }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function kundeLoschen(id: string): Promise<void> {
  const sb = createSupabaseBrowser()
  const { error } = await sb.from('kunden').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ═══════════════════════════════════════════════════════════
// RECHNUNGEN
// ═══════════════════════════════════════════════════════════
export async function ladeRechnungen(): Promise<Rechnung[]> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return []

  const { data } = await sb
    .from('rechnungen')
    .select('*, rechnungspositionen(*)')
    .eq('user_id', user.id)
    .order('erstellt_am', { ascending: false })

  return (data || []).map(r => ({
    id: r.id,
    nummer: r.nummer,
    typ: r.typ || 'rechnung',
    datum: r.rechnungsdatum || '',
    faelligDatum: r.faellig_am || '',
    kundeId: r.kunde_id || '',
    kundeName: r.kunde_name || '',
    kundeAdresse: r.kunde_adresse || '',
    kundeEmail: r.kunde_email || '',
    netto: Number(r.gesamt_netto) || 0,
    mwst: Number(r.gesamt_mwst) || 0,
    gesamt: Number(r.gesamt_brutto) || 0,
    zahlungsziel: r.zahlungsziel || 14,
    notiz: r.fusszeile || '',
    status: r.status || 'entwurf',
    gewerk: r.gewerk || '',
    rabatt: Number(r.rabatt) || 0,
    zeitraumVon: r.leistungsdatum_von || '',
    zeitraumBis: r.leistungsdatum_bis || '',
    mahnstufe: r.mahnstufe || 0,
    positionen: (r.rechnungspositionen || [])
      .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
      .map((p) => ({
        id: p.id,
        beschreibung: p.beschreibung,
        einheit: p.einheit || 'Stk.',
        menge: Number(p.menge) || 1,
        preis: Number(p.einzelpreis) || 0,
        mwst: Number(p.mwst_satz) || 19,
        typ: (p.typ as 'arbeit' | 'material') || undefined,
      })),
  }))
}

export async function rechnungHinzufuegen(rechnung: Rechnung): Promise<Rechnung> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Nicht eingeloggt')

  // Nächste Sequenznummer aus DB ermitteln (verhindert Race Conditions bei gleichzeitigen Requests)
  const jahr = new Date(rechnung.datum).getFullYear()
  const { data: seqData } = await sb
    .from('rechnungen')
    .select('nummer_seq')
    .eq('user_id', user.id)
    .eq('nummer_jahr', jahr)
    .order('nummer_seq', { ascending: false })
    .limit(1)

  const naechsteSeq = seqData && seqData.length > 0 ? (seqData[0].nummer_seq ?? 0) + 1 : 1
  const typPrefix = rechnung.typ === 'angebot' ? 'AN' : 'RE'
  const korrekteNummer = `${typPrefix}-${jahr}-${String(naechsteSeq).padStart(4, '0')}`

  const { data: re, error } = await sb
    .from('rechnungen')
    .insert({
      id: rechnung.id,
      user_id: user.id,
      kunde_id: rechnung.kundeId || null,
      nummer: korrekteNummer,
      nummer_jahr: jahr,
      nummer_seq: naechsteSeq,
      typ: rechnung.typ || 'rechnung',
      status: rechnung.status || 'entwurf',
      rechnungsdatum: rechnung.datum,
      faellig_am: rechnung.faelligDatum || null,
      kunde_name: rechnung.kundeName,
      kunde_adresse: rechnung.kundeAdresse,
      kunde_email: rechnung.kundeEmail,
      gesamt_netto: rechnung.netto,
      gesamt_mwst: rechnung.mwst,
      gesamt_brutto: rechnung.gesamt,
      zahlungsziel: rechnung.zahlungsziel,
      fusszeile: rechnung.notiz,
      gewerk: rechnung.gewerk,
      rabatt: rechnung.rabatt,
      leistungsdatum_von: rechnung.zeitraumVon || null,
      leistungsdatum_bis: rechnung.zeitraumBis || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (rechnung.positionen?.length > 0) {
    await sb.from('rechnungspositionen').insert(
      rechnung.positionen.map((p, i) => ({
        id: p.id,
        rechnung_id: re.id,
        position: i + 1,
        beschreibung: p.beschreibung,
        einheit: p.einheit,
        menge: p.menge,
        einzelpreis: p.preis,
        mwst_satz: p.mwst,
        typ: p.typ,
      }))
    )
  }

  // Rechnung mit der DB-generierten Nummer zurückgeben
  return { ...rechnung, nummer: korrekteNummer }
}

export async function rechnungAktualisieren(id: string, updates: Partial<Rechnung>): Promise<void> {
  const sb = createSupabaseBrowser()

  const dbUpdates: Record<string, unknown> = {}
  if (updates.status !== undefined)       dbUpdates.status = updates.status
  if (updates.typ !== undefined)          dbUpdates.typ = updates.typ
  if (updates.datum !== undefined)        dbUpdates.rechnungsdatum = updates.datum
  if (updates.faelligDatum !== undefined) dbUpdates.faellig_am = updates.faelligDatum
  if (updates.kundeId !== undefined)      dbUpdates.kunde_id = updates.kundeId
  if (updates.kundeName !== undefined)    dbUpdates.kunde_name = updates.kundeName
  if (updates.kundeAdresse !== undefined) dbUpdates.kunde_adresse = updates.kundeAdresse
  if (updates.kundeEmail !== undefined)   dbUpdates.kunde_email = updates.kundeEmail
  if (updates.netto !== undefined)        dbUpdates.gesamt_netto = updates.netto
  if (updates.mwst !== undefined)         dbUpdates.gesamt_mwst = updates.mwst
  if (updates.gesamt !== undefined)       dbUpdates.gesamt_brutto = updates.gesamt
  if (updates.zahlungsziel !== undefined) dbUpdates.zahlungsziel = updates.zahlungsziel
  if (updates.gewerk !== undefined)       dbUpdates.gewerk = updates.gewerk
  if (updates.rabatt !== undefined)       dbUpdates.rabatt = updates.rabatt
  if (updates.zeitraumVon !== undefined)  dbUpdates.leistungsdatum_von = updates.zeitraumVon || null
  if (updates.zeitraumBis !== undefined)  dbUpdates.leistungsdatum_bis = updates.zeitraumBis || null
  if (updates.notiz !== undefined)        dbUpdates.fusszeile = updates.notiz
  if (updates.mahnstufe !== undefined)    dbUpdates.mahnstufe = updates.mahnstufe
  dbUpdates.aktualisiert_am = new Date().toISOString()

  await sb.from('rechnungen').update(dbUpdates).eq('id', id)

  // Positionen aktualisieren wenn mitgegeben
  if (updates.positionen) {
    await sb.from('rechnungspositionen').delete().eq('rechnung_id', id)
    if (updates.positionen.length > 0) {
      await sb.from('rechnungspositionen').insert(
        updates.positionen.map((p, i) => ({
          id: p.id,
          rechnung_id: id,
          position: i + 1,
          beschreibung: p.beschreibung,
          einheit: p.einheit,
          menge: p.menge,
          einzelpreis: p.preis,
          mwst_satz: p.mwst,
          typ: p.typ,
        }))
      )
    }
  }
}

export async function angebotZuRechnung(id: string, datum: string): Promise<string> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Nicht eingeloggt')

  // Nächste Sequenznummer aus DB — gleiche Logik wie rechnungHinzufuegen
  const jahr = new Date(datum).getFullYear()
  const { data: seqData } = await sb
    .from('rechnungen')
    .select('nummer_seq')
    .eq('user_id', user.id)
    .eq('nummer_jahr', jahr)
    .order('nummer_seq', { ascending: false })
    .limit(1)

  const naechsteSeq = seqData && seqData.length > 0 ? (seqData[0].nummer_seq ?? 0) + 1 : 1
  const neueNummer = `RE-${jahr}-${String(naechsteSeq).padStart(4, '0')}`

  const { error } = await sb.from('rechnungen').update({
    status: 'offen',
    typ: 'rechnung',
    nummer: neueNummer,
    nummer_seq: naechsteSeq,
    nummer_jahr: jahr,
    aktualisiert_am: new Date().toISOString(),
  }).eq('id', id)

  if (error) throw new Error(error.message)
  return neueNummer
}

export async function rechnungLoeschen(id: string): Promise<void> {
  const sb = createSupabaseBrowser()
  const { error } = await sb.from('rechnungen').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ═══════════════════════════════════════════════════════════
// FAVORITEN
// ═══════════════════════════════════════════════════════════
export async function ladeFavoriten(): Promise<FavoritItem[]> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return []

  const { data } = await sb
    .from('favoriten')
    .select('*')
    .eq('user_id', user.id)
    .order('erstellt_am', { ascending: false })

  return (data || []).map(f => ({
    id: f.id,
    beschreibung: f.beschreibung,
    einheit: f.einheit || 'Stk.',
    preis: Number(f.preis) || 0,
    mwst: f.mwst_satz || 19,
    typ: (f.typ as 'arbeit' | 'material') || undefined,
  }))
}

export async function favoritHinzufuegen(fav: Omit<FavoritItem, 'id'>): Promise<FavoritItem> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Nicht eingeloggt')

  const { data, error } = await sb.from('favoriten').insert({
    user_id: user.id,
    beschreibung: fav.beschreibung,
    einheit: fav.einheit,
    preis: fav.preis,
    mwst_satz: fav.mwst || 19,
    typ: fav.typ,
  }).select().single()

  if (error) throw error
  return {
    id: data.id,
    beschreibung: data.beschreibung,
    einheit: data.einheit || 'Stk.',
    preis: Number(data.preis) || 0,
    mwst: data.mwst_satz || 19,
    typ: (data.typ as 'arbeit' | 'material') || undefined,
  }
}

export async function favoritLoeschen(id: string): Promise<void> {
  const sb = createSupabaseBrowser()
  const { error } = await sb.from('favoriten').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function favoritAktualisieren(id: string, up: Omit<FavoritItem, 'id'>): Promise<void> {
  const sb = createSupabaseBrowser()
  const { error } = await sb.from('favoriten').update({
    beschreibung: up.beschreibung,
    einheit: up.einheit,
    preis: up.preis,
    mwst_satz: up.mwst || 19,
    typ: up.typ || null,
  }).eq('id', id)
  if (error) throw new Error(error.message)
}

// ═══════════════════════════════════════════════════════════
// WIEDERKEHREND
// ═══════════════════════════════════════════════════════════
export async function ladeWiederkehrend(): Promise<WiederkehrendItem[]> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return []

  const { data } = await sb
    .from('wiederkehrend')
    .select('*')
    .eq('user_id', user.id)
    .order('erstellt_am', { ascending: false })

  return (data || []).map(w => ({
    id: w.id,
    name: w.name || '',
    kundeId: w.kunde_id || '',
    kundeName: w.kunde_name || '',
    kundeAdresse: w.kunde_adresse || '',
    kundeEmail: w.kunde_email || '',
    positionen: (w.positionen as unknown as Position[]) || [],
    netto: Number(w.netto) || 0,
    mwst: Number(w.mwst_betrag) || 0,
    gesamt: Number(w.gesamt) || 0,
    zahlungsziel: w.zahlungsziel || 14,
    notiz: w.notiz || '',
    gewerk: w.gewerk || '',
    rabatt: Number(w.rabatt) || 0,
    interval: (w.interval as 'monatlich' | 'quartal' | 'jaehrlich') || 'monatlich',
    nextDue: w.next_due || '',
    aktiv: w.aktiv ?? true,
  }))
}

export async function wiederkehrendHinzufuegen(w: Omit<WiederkehrendItem, 'id'>): Promise<WiederkehrendItem> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Nicht eingeloggt')

  const { data, error } = await sb.from('wiederkehrend').insert({
    user_id: user.id,
    name: w.name,
    kunde_id: w.kundeId || null,
    kunde_name: w.kundeName,
    kunde_adresse: w.kundeAdresse,
    kunde_email: w.kundeEmail,
    positionen: w.positionen as unknown as import('@/types/supabase').Json,
    netto: w.netto,
    mwst_betrag: w.mwst,
    gesamt: w.gesamt,
    zahlungsziel: w.zahlungsziel,
    notiz: w.notiz,
    gewerk: w.gewerk,
    rabatt: w.rabatt,
    interval: w.interval,
    next_due: w.nextDue,
    aktiv: w.aktiv,
  }).select().single()

  if (error) throw error
  return { ...w, id: data.id }
}

export async function wiederkehrendAktualisieren(id: string, updates: Partial<WiederkehrendItem>): Promise<void> {
  const sb = createSupabaseBrowser()
  const dbUpdates: Record<string, unknown> = {}
  if (updates.aktiv !== undefined)      dbUpdates.aktiv = updates.aktiv
  if (updates.nextDue !== undefined)    dbUpdates.next_due = updates.nextDue
  if (updates.name !== undefined)       dbUpdates.name = updates.name
  if (updates.interval !== undefined)   dbUpdates.interval = updates.interval
  if (updates.positionen !== undefined) dbUpdates.positionen = updates.positionen
  if (updates.netto !== undefined)      dbUpdates.netto = updates.netto
  if (updates.mwst !== undefined)       dbUpdates.mwst_betrag = updates.mwst
  if (updates.gesamt !== undefined)     dbUpdates.gesamt = updates.gesamt

  await sb.from('wiederkehrend').update(dbUpdates).eq('id', id)
}

export async function wiederkehrendLoeschen(id: string): Promise<void> {
  const sb = createSupabaseBrowser()
  const { error } = await sb.from('wiederkehrend').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ═══════════════════════════════════════════════════════════
// BULK-OPERATIONEN (Löschen + Import)
// ═══════════════════════════════════════════════════════════
export async function allesDatenLoeschen(): Promise<void> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return

  // Reihenfolge wichtig: Positionen werden via CASCADE gelöscht
  await sb.from('rechnungen').delete().eq('user_id', user.id)
  await sb.from('kunden').delete().eq('user_id', user.id)
  await sb.from('favoriten').delete().eq('user_id', user.id)
  await sb.from('wiederkehrend').delete().eq('user_id', user.id)
  await sb.from('profiles').delete().eq('id', user.id)
}

export async function kundenImportieren(kunden: Kunde[]): Promise<void> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user || kunden.length === 0) return

  await sb.from('kunden').upsert(
    kunden.map(k => ({
      id: k.id,
      user_id: user.id,
      name: k.name,
      strasse: k.strasse || '',
      plz: k.plz || '',
      ort: k.ort || '',
      email: k.email || '',
      telefon: k.telefon || '',
    }))
  )
}

export async function favoritenImportieren(favs: FavoritItem[]): Promise<void> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user || favs.length === 0) return

  await sb.from('favoriten').insert(
    favs.map(f => ({
      user_id: user.id,
      beschreibung: f.beschreibung,
      einheit: f.einheit,
      preis: f.preis,
      mwst_satz: f.mwst || 19,
      typ: f.typ,
    }))
  )
}

export async function wiederkehrendImportieren(items: WiederkehrendItem[]): Promise<void> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user || items.length === 0) return

  await sb.from('wiederkehrend').insert(
    items.map(w => ({
      user_id: user.id,
      name: w.name,
      kunde_id: w.kundeId || null,
      kunde_name: w.kundeName,
      kunde_adresse: w.kundeAdresse,
      kunde_email: w.kundeEmail,
      positionen: w.positionen as unknown as import('@/types/supabase').Json,
      netto: w.netto,
      mwst_betrag: w.mwst,
      gesamt: w.gesamt,
      zahlungsziel: w.zahlungsziel,
      notiz: w.notiz,
      gewerk: w.gewerk,
      rabatt: w.rabatt,
      interval: w.interval,
      next_due: w.nextDue,
      aktiv: w.aktiv,
    }))
  )
}

// ═══════════════════════════════════════════════════════════
// PLAN
// ═══════════════════════════════════════════════════════════
export async function ladePlan(): Promise<string> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return 'free'

  const { data } = await sb
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  return data?.plan || 'free'
}

export async function speicherePlan(plan: string): Promise<void> {
  const sb = createSupabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return

  await sb
    .from('profiles')
    .update({ plan })
    .eq('id', user.id)
}

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════
export async function abmelden(): Promise<void> {
  const sb = createSupabaseBrowser()
  await sb.auth.signOut()
}
