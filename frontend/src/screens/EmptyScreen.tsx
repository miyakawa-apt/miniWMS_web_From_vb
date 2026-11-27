type Props = {
  title: string
  onBack: () => void
}

// 遷移先の空画面（中身は別イシューで実装する）
export default function EmptyScreen({ title, onBack }: Props) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-4 text-gray-500">（この画面は未実装です）</p>
      <button type="button" className="mt-6 rounded border px-4 py-2 hover:bg-gray-100" onClick={onBack}>
        メインメニューへ戻る
      </button>
    </section>
  )
}
