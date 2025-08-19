-- --------------------------------------------------
-- 1) PLATFORM
-- --------------------------------------------------
CREATE TABLE platform (
    platform_ID VARCHAR(50) PRIMARY KEY NOT NULL,
    title TEXT,
    organism TEXT,
    technology TEXT,
    descript TEXT,
    created_at DATE,
    updated_at DATE
);

-- --------------------------------------------------
-- 2) PLATFORM_ARRAY
-- --------------------------------------------------
CREATE TABLE platform_array (
    id               VARCHAR(255),
    gb_acc           VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
    spot_id          TEXT,
    species_scientific_name VARCHAR(255),
    annotation_data  VARCHAR(50),  -- not normal date format used in GEO
    sequence_type    VARCHAR(50),
    target_description TEXT,
    representative_public_id VARCHAR(50),
    gene_title       VARCHAR(127),
    gene_symbol      VARCHAR(50),
    entrez_gene_id   VARCHAR(255),
    refseq_transcript_id VARCHAR(255),
    gene_ontology_biological_process TEXT,
    gene_ontology_cellular_component TEXT,
    gene_ontology_molecular_function TEXT,
    platform_ID      VARCHAR(50) NOT NULL,
    FOREIGN KEY (platform_ID) REFERENCES platform(platform_ID) ON DELETE CASCADE
);

-- --------------------------------------------------
-- 3) SAMPLES
-- --------------------------------------------------
CREATE TABLE samples (
    sample_ID    VARCHAR(50) PRIMARY KEY NOT NULL,
    title        TEXT,
    source_name  TEXT,
    organism     TEXT,
    characteristics JSON,
    protocol     TEXT,
    created_at   DATE,
    updated_at   DATE,
    platform_ID  VARCHAR(50),
    FOREIGN KEY (platform_ID) REFERENCES platform(platform_ID) ON DELETE SET NULL
);

CREATE TABLE sample_array (
    id_ref         VARCHAR(50) PRIMARY KEY NOT NULL,
    value          FLOAT,
    abs_call       CHAR(1),
    detection_p_value FLOAT,
    sample_ID      VARCHAR(50) NOT NULL,
    FOREIGN KEY (sample_ID) REFERENCES samples(sample_ID) ON DELETE CASCADE
);

-- --------------------------------------------------
-- 4) SERIES & JOIN
-- --------------------------------------------------
CREATE TABLE series (
    series_ID    VARCHAR(50) PRIMARY KEY NOT NULL,
    title        TEXT,
    summary      TEXT,
    overall_design TEXT,
    supplementary_data_link TEXT,
    created_at   DATE,
    updated_at   DATE
);

CREATE TABLE series_samples (
    series_ID  VARCHAR(50) NOT NULL,
    sample_ID  VARCHAR(50) NOT NULL,
    PRIMARY KEY (series_ID, sample_ID),
    FOREIGN KEY (series_ID) REFERENCES series(series_ID) on delete cascade,
    FOREIGN KEY (sample_ID) REFERENCES samples(sample_ID) on delete cascade
);

-- --------------------------------------------------
-- 5) DUMMY DATA
-- --------------------------------------------------
INSERT INTO platform VALUES
  ('GPL100','Human Genome U133A Array','Homo sapiens','microarray','Affymetrix 133A platform','2023-01-01','2023-01-05'),
  ('GPL200','Mouse Genome 430 2.0 Array','Mus musculus','microarray','Affymetrix 430 2.0 platform','2022-12-10','2022-12-15'),
  ('GPL300','Illumina HumanHT-12','Homo sapiens','sequencing','Illumina expression beadchip','2023-02-01','2023-02-03'),
  ('GPL400','Custom Zebrafish Array','Danio rerio','microarray','Zebrafish custom array','2021-11-20','2021-11-21');

INSERT INTO platform_array VALUES
  ('1','ACC1001','SPOT001','Homo sapiens','2022-05','oligonucleotide','target A','PUB1234','Tumor necrosis factor','TNF','7124','NM_000594','GO:0006954','GO:0005576','GO:0005125','GPL100'),
  ('2','ACC1002','SPOT002','Mus musculus','2021-09','oligonucleotide','target B','PUB1235','Interleukin 6','IL6','3569','NM_001318045','GO:0005125','GO:0005576','GO:0006954','GPL200'),
  ('3','ACC1003','SPOT003','Homo sapiens','2022-07','cDNA','target C','PUB1236','TP53','TP53','7157','NM_000546','GO:0006977','GO:0005634','GO:0003700','GPL100'),
  ('4','ACC1004','SPOT004','Danio rerio','2021-10','oligonucleotide','target D','PUB1237','Myod1','myod1','464326','NM_131878','GO:0008283','GO:0005829','GO:0003700','GPL400');

INSERT INTO samples VALUES
  ('GSM5001','Lung Tumor Sample 1','lung','Homo sapiens','{\"gender\":\"male\",\"age\":\"65\"}','extraction protocol A','2023-03-01','2023-03-05','GPL100'),
  ('GSM5002','Lung Normal Sample 1','lung','Homo sapiens','{\"gender\":\"female\",\"age\":\"59\"}','extraction protocol A','2023-03-01','2023-03-05','GPL100'),
  ('GSM5003','Mouse Heart Sample','heart','Mus musculus','{\"strain\":\"C57BL/6\",\"treatment\":\"control\"}','protocol B','2022-10-01','2022-10-05','GPL200'),
  ('GSM5004','Zebrafish Tail Fin Sample','tail fin','Danio rerio','{\"development_stage\":\"adult\"}','protocol Z','2021-12-10','2021-12-15','GPL400');

INSERT INTO sample_array VALUES
  ('ACC1001',12.5,'P',0.0012,'GSM5001'),
  ('ACC1002',8.9,'A',0.05,'GSM5002'),
  ('ACC1003',15.3,'P',0.0001,'GSM5003'),
  ('ACC1004',9.1,'M',0.008,'GSM5004');

INSERT INTO series VALUES
  ('GSE1001','Lung Cancer Study','Tumor vs normal lung samples','Two‑group comparison','https://geo/supp/GSE1001','2023-04-01','2023-04-03'),
  ('GSE1002','Mouse Cardiac Study','Drug treated vs control mice','4 conditions with replicates','https://geo/supp/GSE1002','2022-11-01','2022-11-02'),
  ('GSE1003','Zebrafish Development','Gene expression in tail fin regeneration','Time course design','https://geo/supp/GSE1003','2021-12-20','2021-12-22'),
  ('GSE1004','IL6 Knockout Study','Knockout vs wildtype in liver','Knockout study using microarrays','https://geo/supp/GSE1004','2022-01-15','2022-01-16');

INSERT INTO series_samples VALUES
  ('GSE1001','GSM5001'),
  ('GSE1001','GSM5002'),
  ('GSE1002','GSM5003'),
  ('GSE1003','GSM5004');

