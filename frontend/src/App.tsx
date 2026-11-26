import { useEffect, useState } from 'react'

type Health = { status: string; db: string; time: string }

function formatNow(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}年${p(d.getMonth() + 1)}月${p(d.getDate())}日 ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

export default function App() {
  const [now, setNow] = useState(() => new Date())
  const [health, setHealth] = useState<Health | null>(null)
  const [error, setError] = useState(false)

  // 現在時刻（VBの全画面にある時計。1秒ごとに更新）
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // バックエンドのヘルスチェック
  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: Health) => setHealth(data))
      .catch(() => setError(true))
  }, [])

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="flex items-center justify-between border-b pb-3">
        <h1 className="text-2xl font-bold">miniWMS</h1>
        <span className="text-sm text-gray-600">{formatNow(now)}</span>
      </header>

      <section className="mt-6">
        <p className="text-gray-700">
          VBで作られた簡易倉庫管理システムを、Webアプリとして作り直している実験用プロジェクトです。
          各画面は順次実装します（現在は土台のみ）。
        </p>
      </section>

      <section className="mt-6 rounded border p-4">
        <h2 className="mb-2 font-semibold">バックエンドの状態</h2>
        {error && <p className="text-red-600">接続できません（バックエンド未起動）</p>}
        {!error && !health && <p className="text-gray-500">確認中...</p>}
        {health && (
          <dl className="grid grid-cols-[6rem_1fr] gap-1 text-sm">
            <dt className="text-gray-500">アプリ</dt>
            <dd>{health.status}</dd>
            <dt className="text-gray-500">データベース</dt>
            <dd>{health.db}</dd>
          </dl>
        )}
      </section>
    </main>
  )
}
