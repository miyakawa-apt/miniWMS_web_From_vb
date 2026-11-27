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

## VSCodeの再生ボタンで起動する

VSCode の「実行とデバッグ」から、バックエンド・フロント・ブラウザを再生ボタン1回で起動できます。上の「起動方法」（`dev.ps1` やコマンド手順）は変更しておらず、VSCode を使わない場合は今までどおり起動できます。

`.vscode` は Git の管理対象外（`.gitignore` 済み）のため、設定ファイルはリポジトリに入っていません。下の手順で各自の PC に作ります。

### 前提

- Java 25、Node.js、Docker（Docker Desktop。起動しておく）
- `.env` を作成済み（`Copy-Item .env.example .env` のあと、パスワードなどを自分で設定する。値は設定ファイルに書かない）
- VSCode でリポジトリのルート（`docker-compose.yml` があるフォルダ）を開く
- VSCode の拡張機能：
  - Extension Pack for Java（Java のデバッグ。`type: java` の起動に必要）
  - ブラウザ起動（`type: msedge`）は VSCode 組み込みの JavaScript デバッガーが担当するため、追加の拡張機能は不要（Microsoft Edge がインストールされていること）。Chrome を使う場合は `type` を `chrome` にする

### 設定ファイルの作り方

リポジトリのルートに `.vscode` フォルダを作り、次の2ファイルを作成します（コメントは書かない）。

`.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "バックエンド（Spring Boot）",
      "type": "java",
      "request": "launch",
      "mainClass": "com.apt.miniwms.MiniWmsApplication",
      "projectName": "miniwms-backend",
      "cwd": "${workspaceFolder}/backend",
      "envFile": "${workspaceFolder}/.env",
      "console": "integratedTerminal"
    },
    {
      "name": "フロント（Vite）",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "cwd": "${workspaceFolder}/frontend"
    },
    {
      "name": "ブラウザで画面を開く（5173）",
      "type": "msedge",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/frontend/src"
    }
  ],
  "compounds": [
    {
      "name": "バックエンド＋フロントを起動",
      "configurations": ["バックエンド（Spring Boot）", "フロント（Vite）"],
      "preLaunchTask": "開発の準備（DB・フロントの部品）",
      "stopAll": true
    },
    {
      "name": "バックエンド＋フロント＋ブラウザ",
      "configurations": ["バックエンド（Spring Boot）", "フロント（Vite）", "ブラウザで画面を開く（5173）"],
      "preLaunchTask": "開発の準備（DB・フロントの部品）",
      "stopAll": true
    }
  ]
}
```

`.vscode/tasks.json`（起動前に DB の起動とフロント部品の準備を自動で行う。シェルの種類に依存しない書き方）

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "DBを起動",
      "type": "shell",
      "command": "docker compose up -d --wait db",
      "problemMatcher": []
    },
    {
      "label": "フロントの部品を入れる",
      "type": "shell",
      "command": "npm install",
      "options": { "cwd": "${workspaceFolder}/frontend" },
      "problemMatcher": []
    },
    {
      "label": "開発の準備（DB・フロントの部品）",
      "dependsOn": ["DBを起動", "フロントの部品を入れる"],
      "dependsOrder": "parallel",
      "problemMatcher": []
    }
  ]
}
```

### 使い方

1. VSCode の左のバーで「実行とデバッグ」を開く
2. 上部の一覧から「バックエンド＋フロント＋ブラウザ」を選ぶ
3. 再生ボタン（緑の三角）を押す

DB が起動し、フロントの部品が準備されたあと、バックエンド（http://localhost:8080）、フロント（http://localhost:5173）、ブラウザの順に起動します。バックエンドの起動に1分ほどかかるため、画面に API のエラーが出たら少し待って再読み込みしてください。

- ブラウザを開かないときは「バックエンド＋フロントを起動」を選ぶ。1つだけ起動するときは、一覧から「バックエンド（Spring Boot）」「フロント（Vite）」「ブラウザで画面を開く（5173）」を個別に選ぶ
- 止めるときは、停止ボタンを押す（`stopAll` により3つとも止まる）。DB は動いたままなので、止めるときは `docker compose down` を実行する

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
