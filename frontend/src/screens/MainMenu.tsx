import { useState } from 'react'
import { adminItems, businessItems, type MenuItem, type ScreenId } from './screens'

type Props = {
  onNavigate: (id: ScreenId) => void
}

// ログイン状態（仮。ログイン機能は別イシューのため、常にログアウト状態）
const loggedIn = false

export default function MainMenu({ onNavigate }: Props) {
  // クイック：認証なしで全ボタンを押せるようにするテスト用スイッチ（VBのクイックボタンと同じ）
  const [quick, setQuick] = useState(false)

  // ログアウト状態では権限が必要なボタンは無効。クイックが ON のときは全ボタン有効
  // （ログイン後の権限判定は未実装）
  const isEnabled = (_item: MenuItem) => quick || loggedIn

  const renderButton = (item: MenuItem) => (
    <button
      key={item.id}
      type="button"
      disabled={!isEnabled(item)}
      className="rounded border px-4 py-3 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      onClick={() => onNavigate(item.id)}
    >
      {item.label}
    </button>
  )

  return (
    <section>
      <h2 className="text-xl font-semibold">メインメニュー</h2>
      <p className="mt-2 text-sm text-gray-600">{loggedIn ? 'ログイン中' : 'ログアウト中'}</p>

      <div className="mt-4 flex gap-2">
        <button type="button" className="rounded border px-4 py-2 hover:bg-gray-100" onClick={() => onNavigate('login')}>
          ログイン
        </button>
        <button
          type="button"
          aria-pressed={quick}
          className={`rounded border px-4 py-2 ${quick ? 'bg-yellow-200' : 'hover:bg-gray-100'}`}
          onClick={() => setQuick((v) => !v)}
        >
          クイック
        </button>
      </div>

      <h3 className="mt-6 mb-2 font-semibold">業務メニュー</h3>
      <div className="grid grid-cols-2 gap-2">{businessItems.map(renderButton)}</div>

      <h3 className="mt-6 mb-2 font-semibold">管理者メニュー</h3>
      <div className="grid grid-cols-2 gap-2">{adminItems.map(renderButton)}</div>
    </section>
  )
}
