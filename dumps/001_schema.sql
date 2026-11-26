-- miniWMS Web版 スキーマ（PostgreSQL 17）
-- VB原本のSQL文・画面の入力桁から推定した定義。根拠は docs/02_テーブル定義.md を参照。
-- 実DBのDDLとの突き合わせは未確認。データ（INSERT）は含まない。
-- 識別子は小文字のスネークケース（VBのSQLは引用符なしのため小文字に畳まれる）。

CREATE TABLE m_user (
    user_id     varchar(4)  PRIMARY KEY,
    user_name   varchar(50) NOT NULL,
    password    varchar(14) NOT NULL,
    user_power  varchar(10) NOT NULL CHECK (user_power IN ('管理者', '一般')),
    ent_date    timestamp   NOT NULL DEFAULT now(),
    edit_date   timestamp   NOT NULL DEFAULT now()
);

CREATE TABLE m_products (
    product_cd     varchar(8)   PRIMARY KEY,
    product_name   varchar(100) NOT NULL,
    category       varchar(20)  NOT NULL
        CHECK (category IN ('食品', '飲料', '日用品', '文房具', '梱包資材', 'その他')),
    unit_price     integer      NOT NULL,
    case_quantity  integer      NOT NULL,
    ent_date       timestamp    NOT NULL DEFAULT now(),
    edit_date      timestamp    NOT NULL DEFAULT now()
);

CREATE TABLE m_location (
    tana_cd      varchar(9)   PRIMARY KEY,           -- 列-連-段（例：2桁-3桁-2桁）
    tana_retu    varchar(2)   NOT NULL,
    tana_ren     varchar(3)   NOT NULL,
    tana_dan     varchar(2)   NOT NULL,
    tana_status  varchar(10)  NOT NULL CHECK (tana_status IN ('空棚', '実棚')),
    bikou        varchar(100),
    ent_date     timestamp    NOT NULL DEFAULT now(),
    edit_date    timestamp    NOT NULL DEFAULT now()
);

CREATE TABLE t_stock (
    stock_id      integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_cd    varchar(8)  NOT NULL REFERENCES m_products (product_cd),
    tana_cd       varchar(9)  NOT NULL REFERENCES m_location (tana_cd),
    stock         integer     NOT NULL CHECK (stock >= 0),
    arrival_date  timestamp   NOT NULL DEFAULT now(),
    ent_date      timestamp   NOT NULL DEFAULT now(),
    edit_date     timestamp   NOT NULL DEFAULT now()
);

-- jisseki_id は原本に無い代理キー（Web版で追加する案）。work_date の型は未確認のため timestamp とした。
CREATE TABLE t_jisseki (
    jisseki_id    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sag_kbn       varchar(10) NOT NULL CHECK (sag_kbn IN ('入庫', '出庫', '修正', '削除')),
    work_date     timestamp   NOT NULL DEFAULT now(),
    product_cd    varchar(8)  NOT NULL REFERENCES m_products (product_cd),
    tana_cd       varchar(9)  NOT NULL REFERENCES m_location (tana_cd),
    quantity      integer     NOT NULL,
    before_stock  integer     NOT NULL,
    after_stock   integer     NOT NULL,
    bikou         varchar(200),
    user_id       varchar(4)  NOT NULL REFERENCES m_user (user_id)
);

CREATE INDEX ix_t_stock_product_cd ON t_stock (product_cd);
CREATE INDEX ix_t_stock_tana_cd    ON t_stock (tana_cd);
CREATE INDEX ix_t_jisseki_work_date ON t_jisseki (work_date);
