# miniWMS_web_From_vb

VB（Visual Basic）で作られた miniWMS（簡易倉庫管理システム）を、Webアプリケーションとして丸ごと作り直す実験的リポジトリです。

> **注意：実験的リポジトリです。** 仕様・構成・技術選定は予告なく変更されます。本番利用は想定していません。

## 目的

- 既存のVBプログラムの機能・画面・業務ロジックをWeb化できるかを検証する
- 移行手順・変換方針・課題を整理し、他のWMS資産へ展開できるノウハウを蓄積する

## 方針

- 元のVBプログラムの機能を網羅的にWeb上で再現する
- 画面・業務ロジック・データアクセスを分離し、保守しやすい構成にする
- 移行時に判明した課題や判断を記録として残す

## 技術スタック

| 区分 | 採用技術 |
| --- | --- |
| バックエンド | Java 25 / Spring Boot（Maven） |
| フロントエンド | React + TypeScript（Vite）/ Tailwind CSS v4 |
| データベース | PostgreSQL 17（Docker Compose） |
| コンテナ | Docker |
| 構成 | Spring Boot と React の単一デプロイ（Windows 限定） |

## ディレクトリ構成

```
miniWMS_web_From_vb/
├── README.md
├── docker-compose.yml     PostgreSQL 17（開発用）
├── .env.example           接続設定の例（実値は .env に。コミットしない）
├── backend/               Spring Boot（Maven）。ヘルスチェックAPIのみ
├── frontend/              React + TypeScript（Vite）+ Tailwind CSS v4。トップ画面のみ
├── dumps/                 DBスキーマ（001_schema.sql）
└── docs/                  VBの洗い出し（機能・画面・テーブル・差異・移行の進め方）
```

（実装の進行に合わせて追記します）

## 起動方法

前提：Java 25、Node.js、Docker（Docker Desktop）。Maven は不要（`backend/mvnw` を使う）。

```powershell
# 1. 接続設定を作る（.env はコミットしない。パスワードを自分で設定する）
Copy-Item .env.example .env

# 2. DB（PostgreSQL 17）を起動する（初回にテーブルが作られる）
docker compose up -d db

# 3. フロントをビルドする（出力は backend の static に入る）
cd frontend; npm install; npm run build; cd ..

# 4. バックエンドをビルドして起動する
cd backend; ./mvnw -DskipTests package; cd ..
java -jar backend/target/miniwms-backend-0.0.1-SNAPSHOT.jar
```

- 画面：http://localhost:8080/ ／ ヘルスチェック：http://localhost:8080/api/health（`db` が `up` なら成功）
- 4 の前に、`.env` の値を環境変数として読み込む（`SPRING_DATASOURCE_USERNAME`・`SPRING_DATASOURCE_PASSWORD`・`DB_URL`）
- DB のポートは既定で 15432（この PC に別の PostgreSQL が 5432 で動いていても競合しないため）

## 進め方

1. 元VBプログラムの機能・画面・テーブルの棚卸し
2. Web化の設計（アーキテクチャ・技術選定）
3. 機能単位での実装と、元プログラムとの動作比較
4. 課題・知見のドキュメント化

## ステータス

土台まで実装（洗い出し、DB定義、バックエンド・フロントの雛形）。各画面の実装はこれから（実装順は docs/04_移行の進め方.md）。ビルド・起動は未確認。

## 更新履歴

| 日付 | 内容 |
| --- | --- |
| 2026年11月26日 | リポジトリ作成、README追加 |
| 2026年11月26日 | 技術スタックを明記 |
| 2026年11月26日 | VBの洗い出し（docs）、DB定義・docker-compose、バックエンド・フロントの雛形を追加 |
