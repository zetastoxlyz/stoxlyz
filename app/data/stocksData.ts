import type { Stock } from './stocks'

export type StockDetail = Stock & {
  employees: number
  website: string
  industry: string
  country: string
  eps: number
  beta: number
  avgVolume: number
  openPrice: number
  prevClose: number
  dayHigh: number
  dayLow: number
  notations?: string[]
}

/** Minimal list used for client-side search (ticker + name only). */
export const STOCKS_LIST: { ticker: string; name: string }[] = [
  { ticker: 'BBCA.JK', name: 'Bank Central Asia Tbk' },
  { ticker: 'BBRI.JK', name: 'Bank Rakyat Indonesia Tbk' },
  { ticker: 'BMRI.JK', name: 'Bank Mandiri Tbk' },
  { ticker: 'TLKM.JK', name: 'Telkom Indonesia Tbk' },
  { ticker: 'ASII.JK', name: 'Astra International Tbk' },
  { ticker: 'BYAN.JK', name: 'Bayan Resources Tbk' },
  { ticker: 'UNVR.JK', name: 'Unilever Indonesia Tbk' },
  { ticker: 'ICBP.JK', name: 'Indofood CBP Sukses Makmur Tbk' },
  { ticker: 'KLBF.JK', name: 'Kalbe Farma Tbk' },
  { ticker: 'HMSP.JK', name: 'H.M. Sampoerna Tbk' },
  { ticker: 'GOTO.JK', name: 'GoTo Gojek Tokopedia Tbk' },
  { ticker: 'BBNI.JK', name: 'Bank Negara Indonesia Tbk' },
  { ticker: 'INDF.JK', name: 'Indofood Sukses Makmur Tbk' },
  { ticker: 'SMGR.JK', name: 'Semen Indonesia Tbk' },
  { ticker: 'MNCN.JK', name: 'Media Nusantara Citra Tbk' },
  { ticker: 'CPIN.JK', name: 'Charoen Pokphand Indonesia Tbk' },
  { ticker: 'ADRO.JK', name: 'Alamtri Resources Indonesia Tbk' },
  { ticker: 'PTBA.JK', name: 'Bukit Asam Tbk' },
  { ticker: 'INKP.JK', name: 'Indah Kiat Pulp & Paper Tbk' },
  { ticker: 'EXCL.JK', name: 'XL Axiata Tbk' },
  { ticker: 'SIDO.JK', name: 'Industri Jamu Dan Farmasi Sido Muncul Tbk' },
  { ticker: 'ACES.JK', name: 'Ace Hardware Indonesia Tbk' },
  { ticker: 'MAPI.JK', name: 'Mitra Adiperkasa Tbk' },
  { ticker: 'PWON.JK', name: 'Pakuwon Jati Tbk' },
  { ticker: 'BSDE.JK', name: 'Bumi Serpong Damai Tbk' },
  { ticker: 'JPFA.JK', name: 'Japfa Comfeed Indonesia Tbk' },
  { ticker: 'TKIM.JK', name: 'Tjiwi Kimia Tbk' },
  { ticker: 'SMRA.JK', name: 'Summarecon Agung Tbk' },
  { ticker: 'INTP.JK', name: 'Indocement Tunggal Prakarsa Tbk' },
  { ticker: 'TBIG.JK', name: 'Tower Bersama Infrastructure Tbk' },
  { ticker: 'BUVA.JK', name: 'Bukit Uluwatu Villa Tbk' },
]

/** Notation overrides per ticker. Only stocks with notations are listed. */
export const STOCKS_DATA: Record<string, { notations?: string[] }> = {
  'BBCA.JK': { notations: ['B'] },
  'BBRI.JK': { notations: ['B', 'L'] },
  'TLKM.JK': { notations: ['M'] },
  'KLBF.JK': { notations: ['D'] },
  'HMSP.JK': { notations: ['X'] },
  'GOTO.JK': { notations: ['E', 'S'] },
  'BUVA.JK': { notations: ['C'] },
}
