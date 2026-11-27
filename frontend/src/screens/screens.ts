// 画面の定義（VBのメインメニューのボタンと同じ項目。docs/01_機能・画面一覧.md の 2.2 を参照）
export type ScreenId =
  | 'menu'
  | 'login'
  | 'nyuko'
  | 'syukko'
  | 'stock'
  | 'jisseki'
  | 'stockChange'
  | 'products'
  | 'locations'
  | 'users'

// 必要な権限：general＝一般・管理者、admin＝管理者のみ（VBの権限制御に合わせる）
export type Permission = 'general' | 'admin'

export type MenuItem = {
  id: Exclude<ScreenId, 'menu' | 'login'>
  label: string
  permission: Permission
}

// 業務メニュー（一般・管理者）
export const businessItems: MenuItem[] = [
  { id: 'nyuko', label: '入庫', permission: 'general' },
  { id: 'syukko', label: '出庫', permission: 'general' },
  { id: 'stock', label: '在庫リスト', permission: 'general' },
  { id: 'jisseki', label: '実績照会', permission: 'general' },
]

// 管理者メニュー（管理者のみ）
export const adminItems: MenuItem[] = [
  { id: 'stockChange', label: '在庫修正', permission: 'admin' },
  { id: 'products', label: '商品メンテナンス', permission: 'admin' },
  { id: 'locations', label: 'ロケーションメンテナンス', permission: 'admin' },
  { id: 'users', label: 'ユーザー管理', permission: 'admin' },
]

// 画面タイトル（空画面の見出し用）
export const screenTitles: Record<Exclude<ScreenId, 'menu'>, string> = {
  login: 'ログイン',
  nyuko: '入庫',
  syukko: '出庫',
  stock: '在庫リスト',
  jisseki: '実績照会',
  stockChange: '在庫修正',
  products: '商品メンテナンス',
  locations: 'ロケーションメンテナンス',
  users: 'ユーザー管理',
}
