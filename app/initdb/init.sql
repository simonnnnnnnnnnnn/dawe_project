-- --------------------------------------------------
-- 1) PLATFORM
-- --------------------------------------------------
CREATE TABLE platform (
    platform_ID VARCHAR(50) PRIMARY KEY NOT NULL,
    status_platform varchar(50),
    title TEXT,
    technology TEXT,
    distribution_platform varchar(50),
    organism TEXT,
    manufacturer varchar(50),
    descript TEXT,
    web_link TEXT,
    created_at TEXT,
    updated_at TEXT
);

-- --------------------------------------------------
-- 2) PLATFORM_ARRAY
-- --------------------------------------------------
CREATE TABLE platform_array (
    internal_id      varchar(50) primary key not null,
    id               VARCHAR(255),
    gb_acc           VARCHAR(255),
    spot_id          TEXT,
    species_scientific_name VARCHAR(255),
    annotation_data  VARCHAR(50),  -- not normal date format used in GEO
    sequence_type    VARCHAR(50),
    sequence_source varchar(50),
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
    status_sample varchar(50),
    title TEXT,
    sample_type varchar(50),
    source_name  TEXT,
    organism  TEXT,
    extracted_molecule  varchar(50),
    characteristics JSON,
    descript text,
    created_at   text,
    updated_at   text,
    platform_ID  VARCHAR(50),
    FOREIGN KEY (platform_ID) REFERENCES platform(platform_ID) ON DELETE SET NULL
);

CREATE TABLE sample_array (
    internal_id    varchar(50) primary key not null,
    id_ref         VARCHAR(50),
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
    status_series varchar(50),
    title        TEXT,
    organism  varchar(50),
    experiment_type text,
    summary      TEXT,
    overall_design TEXT,
    contributors  text,
    citation  text,
    supplementary_data_link TEXT,
    created_at   text,
    updated_at   text
);

CREATE TABLE series_samples (
    series_ID  VARCHAR(50) NOT NULL,
    sample_ID  VARCHAR(50) NOT NULL,
    PRIMARY KEY (series_ID, sample_ID),
    FOREIGN KEY (series_ID) REFERENCES series(series_ID) on delete cascade,
    FOREIGN KEY (sample_ID) REFERENCES samples(sample_ID) on delete cascade
);

CREATE TABLE dataset (
    dataset_ID varchar(50) PRIMARY KEY NOT NULL,
    title TEXT,
    summary TEXT,
    organism TEXT,
    citation TEXT,
    platform varchar(50),
    reference_series varchar(50),
    value_type varchar(50),
    sample_count integer,
    FOREIGN KEY (reference_series) REFERENCES series(series_ID) ON DELETE cascade
);

CREATE TABLE profile (
    profile_ID varchar(50) PRIMARY KEY NOT NULL,
    dataset_ID varchar(50),
    title TEXT,
    annotation text,
    organism TEXT,
    dataset_type text,
    FOREIGN KEY (dataset_ID) REFERENCES dataset(dataset_ID) ON DELETE CASCADE
);

CREATE TABLE profile_array (
    profile_array_ID varchar(50) PRIMARY KEY NOT NULL,
    profile_ID varchar(50),
    sample_ID VARCHAR(50),
    title TEXT,
    value_number FLOAT,
    ranking INTEGER,
    FOREIGN KEY (profile_ID) REFERENCES profile(profile_ID) ON DELETE CASCADE
);

-- --------------------------------------------------
-- 5) DUMMY DATA
-- --------------------------------------------------
-- Platforms
INSERT INTO platform VALUES
  ('GPL341','Public on Jun 23, 2003','[RAE230A] Affymetrix Rat Expression 230A Array','in situ oligonucleotide','commercial','Rattus norvegicus','Affymetrix',
  'Array A of GeneChip Rat Expression Set 230. Has 15923 entries and was indexed 09-Apr-2003 Sequences used in the design of the array were selected from GenBank,
  dbEST, and RefSeq. Sequence clusters were created from Build 99 of UniGene (June 2002) and refined by analysis and comparison with a number of other publicly available databases
  including the Baylor College of Medicine Human Genome Sequencing Centers preliminary rat genome assembly (June 2002).
  In addition, sequences were analyzed for untrimmed low-quality sequence information, correct orientation, false clustering, alternative splicing and alternative polyadenylation.',
  'http://www.affymetrix.com/support/technical/byproduct.affx?product=rae230 http://www.affymetrix.com/analysis/index.affx',
  'Jun 19, 2003', 'Mar 03, 2017'),
  ('GPL342', 'Public on Jun 23, 2003', '[RAE230B] Affymetrix Rat Expression 230B Array', 'in situ oligonucleotide', 'commercial', '	Rattus norvegicus', 'Affymetrix',
  'Array B of GeneChip Rat Expression Set 230 Has 15333 entries and was indexed 09-Apr-2003 Sequences used in the design of the array were selected from GenBank, 
  dbEST, and RefSeq. Sequence clusters were created from Build 99 of UniGene (June 2002) and refined by analysis and comparison with a number of other 
  publicly available databases including the Baylor College of Medicine Human Genome Sequencing Centers preliminary rat genome assembly (June 2002). 
  In addition, sequences were analyzed for untrimmed low-quality sequence information, correct orientation, false clustering, alternative splicing and 
  alternative polyadenylation.', 'http://www.affymetrix.com/support/technical/byproduct.affx?product=rae230 http://www.affymetrix.com/analysis/index.affx',
  'Jun 19, 2003', 'Jun 03, 2009');

-- Platform arrays
INSERT INTO platform_array () VALUES
  ('GPL341_1', 'https://www.thermofisher.com/bg/en/home/life-science/microarray-analysis.html?array=RAE230&probeset=1367452_at','https://www.ncbi.nlm.nih.gov/nuccore/NM_133594','','Rattus norvegicus','Oct 6, 2014','Consensus sequence','GenBank','gb:NM_133594.1 /DB_XREF=gi:19424297 /GEN=Smt3h2 /FEA=FLmRNA /CNT=51 /TID=Rn.5958.1 /TIER=FL+Stack /STK=35 /UG=Rn.5958 /DEF=Rattus norvegicus SMT3 suppressor of mif two 3 homolog 2 (yeast) (Smt3h2), mRNA. /PROD=SMT3 suppressor of mif two 3 homolog 2 (yeast) /FL=gb:NM_133594.1 gb:L79949.1','NM_133594','small ubiquitin-like modifier 2','Sumo2','https://www.ncbi.nlm.nih.gov/gene/690244','NM_133594','0016925 // protein sumoylation // inferred from direct assay /// 0016925 // protein sumoylation // inferred from electronic annotation /// 0016925 // protein sumoylation // not recorded /// 0032436 // positive regulation of proteasomal ubiquitin-dependent protein catabolic process // not recorded /// 0034613 // cellular protein localization // inferred from direct assay /// 0045892 // negative regulation of transcription, DNA-templated // inferred from mutant phenotype /// 0045944 // positive regulation of transcription from RNA polymerase II promoter // not recorded','0005634 // nucleus // inferred from electronic annotation /// 0016605 // PML body // not recorded /// 0016605 // PML body // inferred from sequence or structural similarity	','0005515 // protein binding // inferred from physical interaction /// 0019789 // SUMO ligase activity // not recorded /// 0031625 // ubiquitin protein ligase binding // not recorded /// 0031625 // ubiquitin protein ligase binding // inferred from sequence or structural similarity /// 0044822 // poly(A) RNA binding // not recorded
', 'GPL341'),
  ('GPL341_2', 'https://www.thermofisher.com/bg/en/home/life-science/microarray-analysis.html?array=RAE230&probeset=1367453_at', 'https://www.ncbi.nlm.nih.gov/nuccore/NM_053743', '', 'Rattus norvegicus', 'Oct 6, 2014', 'Consensus sequence', 'GenBank', 'gb:NM_053743.1 /DB_XREF=gi:16758569 /GEN=Cdc37 /FEA=FLmRNA /CNT=31 /TID=Rn.17982.1 /TIER=FL+Stack /STK=25 /UG=Rn.17982 /LL=114562 /DEF=Rattus norvegicus CDC37 (cell division cycle 37, S. cerevisiae, homolog) (Cdc37), mRNA. /PROD=CDC37 (cell division cycle 37, S. cerevisiae,homolog) /FL=gb:D26564.1 gb:NM_053743.1', 'NM_053743', '	cell division cycle 37', '	Cdc37', 'https://www.ncbi.nlm.nih.gov/gene/114562', 'NM_053743', '0051726 // regulation of cell cycle // inferred from expression pattern /// 0060334 // regulation of interferon-gamma-mediated signaling pathway // inferred from electronic annotation /// 0060334 // regulation of interferon-gamma-mediated signaling pathway // not recorded /// 0060338 // regulation of type I interferon-mediated signaling pathway // inferred from electronic annotation /// 0060338 // regulation of type I interferon-mediated signaling pathway // not recorded', '0005737 // cytoplasm // inferred from direct assay /// 0005737 // cytoplasm // not recorded /// 0005829 // cytosol // inferred from electronic annotation /// 0005829 // cytosol // not recorded /// 0032587 // ruffle membrane // inferred from direct assay /// 0043234 // protein complex // inferred from direct assay /// 0070062 // extracellular vesicular exosome // not recorded', '0005515 // protein binding // inferred from electronic annotation /// 0019901 // protein kinase binding // inferred from physical interaction /// 0031072 // heat shock protein binding // not recorded /// 0031435 // mitogen-activated protein kinase kinase kinase binding // inferred from physical interaction /// 0043422 // protein kinase B binding // inferred from physical interaction /// 0051087 // chaperone binding // inferred from physical interaction /// 0051879 // Hsp90 protein binding // inferred from electronic annotation /// 0051879 // Hsp90 protein binding // not recorded
', 'GPL341'),
  ('GPL342_1', 'https://www.thermofisher.com/bg/en/home/life-science/microarray-analysis.html?array=RAE230&probeset=1367452_at', 'https://www.ncbi.nlm.nih.gov/nuccore/NM_133594', '', 'Rattus norvegicus', 'Mar 11, 2009', 'Consensus sequence', 'GenBank', 'gb:NM_133594.1 /DB_XREF=gi:19424297 /GEN=Smt3h2 /FEA=FLmRNA /CNT=51 /TID=Rn.5958.1 /TIER=FL+Stack /STK=35 /UG=Rn.5958 /DEF=Rattus norvegicus SMT3 suppressor of mif two 3 homolog 2 (yeast) (Smt3h2), mRNA. /PROD=SMT3 suppressor of mif two 3 homolog 2 (yeast) /FL=gb:NM_133594.1 gb:L79949.1', 'NM_133594', 'SMT3 suppressor of mif two 3 homolog 2 (S. cerevisiae)', 'Sumo2', 'https://www.ncbi.nlm.nih.gov/gene/690244', 'NM_133594 /// XM_001073823', '0006464 // protein modification process // inferred from electronic annotation /// 0006511 // ubiquitin-dependent protein catabolic process // inferred from electronic annotation /// 0006879 // cellular iron ion homeostasis // inferred from electronic annotation', '0005634 // nucleus // inferred from electronic annotation', '0008199 // ferric iron binding // inferred from electronic annotation /// 0016491 // oxidoreductase activity // inferred from electronic annotation /// 0046914 // transition metal ion binding // inferred from electronic annotation
', 'GPL342'),
  ('GPL342_2', 'https://www.thermofisher.com/bg/en/home/life-science/microarray-analysis.html?array=RAE230&probeset=1367453_at', 'http://www.ncbi.nlm.nih.gov/nuccore/?term=NM_053743', '', 'Rattus norvegicus', 'Mar 11, 2009', 'Consensus sequence', 'GenBank', 'gb:NM_053743.1 /DB_XREF=gi:16758569 /GEN=Cdc37 /FEA=FLmRNA /CNT=31 /TID=Rn.17982.1 /TIER=FL+Stack /STK=25 /UG=Rn.17982 /LL=114562 /DEF=Rattus norvegicus CDC37 (cell division cycle 37, S. cerevisiae, homolog) (Cdc37), mRNA. /PROD=CDC37 (cell division cycle 37, S. cerevisiae,homolog) /FL=gb:D26564.1 gb:NM_053743.1', 'NM_053743', 'cell division cycle 37 homolog (S. cerevisiae)', 'Cdc37', 'https://www.ncbi.nlm.nih.gov/gene/114562', 'NM_053743 /// XM_001077364', '0051726 // regulation of cell cycle // inferred from expression pattern', '0005737 // cytoplasm // inferred from electronic annotation /// 0005829 // cytosol // inferred from sequence or structural similarity', '0051879 // Hsp90 protein binding // inferred from sequence or structural similarity
', 'GPL342');

-- Samples
INSERT INTO samples VALUES
  ('GSM12795','Public on Mar 16, 2004','germ cells on STO day 1 GPL341','RNA','germ cells from 22 day old rat testis, cultured for 1 day','Rattus norvegicus','total RNA',null,'50 ng total RNA were amplified using two rounds of amplification. Detection calls were calculated using a Tau value of 0.015. Signal intensities were scaled to an average of 250 (scale factor 0.510).
Keywords = Rat, testis, germ cells, stem cells, spermatogenesis', 'Nov 10, 2003', 'May 28, 2005', 'GPL341'),
  ('GSM12793','Public on Mar 16, 2004','germ cells on MSC1 day 20 GPL341','RNA','germ cells from 22 day old rat testis, cultured for 20 days','Rattus norvegicus','total RNA',null, '50 ng total RNA were amplified using two rounds of amplification. Detection calls were calculated using a Tau value of 0.015. Signal intensities were scaled to an average of 250 (scale factor 1.098).
Keywords = Rat, testis, germ cells, stem cells, spermatogenesis', 'Nov 10, 2003', 'May 28, 2005', 'GPL341'),
  ('GSM12794', 'Public on Mar 16, 2004', 'germ cells on MSC1 day 20 GPL342', 'RNA', 'germ cells from 22 day old rat testis, cultured for 20 days', 'Rattus norvegicus', 'total RNA', null, '50 ng total RNA were amplified using two rounds of amplification. Detection calls were calculated using a Tau value of 0.015. Signal intensities were scaled to an average of 250 (scale factor 3.100).
Keywords = Rat, testis, germ cells, stem cells, spermatogenesis', 'Nov 10, 2003', 'May 28, 2005', 'GPL342'),
  ('GSM12796', 'Public on Mar 16, 2004','germ cells on STO day 1 GPL342','RNA','germ cells from 22 day old rat testis, cultured for 1 day','Rattus norvegicus','total RNA',null, '50 ng total RNA were amplified using two rounds of amplification. Detection calls were calculated using a Tau value of 0.015. Signal intensities were scaled to an average of 250 (scale factor 1.546).
Keywords = Rat, testis, germ cells, stem cells, spermatogenesis', 'Nov 10, 2003', '	May 28, 2005', 'GPL342');

-- Sample arrays (expression values per sample)
INSERT INTO sample_array VALUES
  ('GSM12793_1', 'AFFX-BioB-5_at',539.8,'P', 0.002023, 'GSM12793'),
  ('GSM12793_2', 'AFFX-BioB-M_at', 784.7, 'P', 0.000044, 'GSM12793'),
  ('GSM12795_1', 'AFFX-BioB-5_at', 148.9, 'P', 0.003212, 'GSM12795'),
  ('GSM12795_2', 'AFFX-BioB-M_at', 236.6, 'P', 0.000044, 'GSM12795'),
  ('GSM12794_1', 'AFFX-BioB-5_at', 1303.7, 'P', 0.002556, 'GSM12794'),
  ('GSM12794_2', 'AFFX-BioB-M_at', 2324.0, 'P', 0.000044, 'GSM12794'),
  ('GSM12796_1', 'AFFX-BioB-5_at', 412.2, 'P', 0.001796, 'GSM12796'),
  ('GSM12796_2', 'AFFX-BioB-M_at', 590.3, 'P', 0.000044, 'GSM12796');

-- Series (studies)
INSERT INTO series VALUES
  ('GSE830','	Public on Mar 16, 2004','Rat germ cells','Rattus norvegicus','Expression profiling by array','Rat germ cells
Keywords: other', '', 'Hamra FK, Schultz N, Chapman KM, Grellhesl DM, Cronkhite JT, Hammer RE, Garbers DL', 'Hamra FK, Schultz N, Chapman KM, Grellhesl DM et al. Defining the spermatogonial stem cell. Dev Biol 2004 May 15;269(2):393-410. PMID: 15110708', 'GSE830_RAW.tar', 'Nov 10, 2003', 'Mar 03, 2017'),
  ('GSE3541', 'Public on Apr 29, 2006', 'DNA microarray reveals novel genes induced by mechanical forces in fetal lung type II epithelial cells', 'Rattus norvegicus', 'Expression profiling by array', 'Mechanical forces are essential for normal fetal lung development. However, the cellular and molecular mechanisms regulating this process remain largely unknown. In the present study, we used oligonucleotide microarray technology to investigate gene expression profile in cultured E19 rat fetal lung type II epithelial cells exposed to a level of mechanical strain similar to that observed in utero. Significance Analysis of Microarrays (SAM) identified 92 genes differentially expressed by strain. Interestingly, several members of the solute carrier family of amino acid transporters, genes involved in amino acid synthesis and development, and amiloride-sensitive epithelial sodium channel gene were induced by strain. These results were confirmed by quantitative real-time polymerase chain reaction (qRT-PCR). Thus, this study identifies genes induced by strain that may be important for amino acid signaling pathways, protein synthesis and development in fetal type II cells. In addition, these data suggest that mechanical forces may contribute to facilitate lung fluid reabsorption in preparation for birth. Taken together, the present investigation provides further insights into how mechanical forces may modulate fetal lung development.
Keywords: lung development, fetal type II epithelial cells, strain response, microarray', '	Freshly isolated E19 fetal type II epithelial cells were plated on silastic membranes coated with collagen 1 and exposed to mechanical strain for 16 h to simulate mechanical forces in utero (5% cyclic strain, 60 cycles/min for 15 min + 2.5% continuous distention for the remaining 45 min of each hour) using the Flexercell FX-4000 Strain Unit. Cell grown on non-strained substrates were treated in an identical manner and served as controls. 3 pairs of control and strain samples were analyzed, using different litters for each pair (6 hybridizations).', 'Wang Y, Maciejewski BS, Weissman G, Silbert O, Han H, Sanchez-Esteban J', '	
Wang Y, Maciejewski BS, Weissmann G, Silbert O et al. DNA microarray reveals novel genes induced by mechanical forces in fetal lung type II epithelial cells. Pediatr Res 2006 Aug;60(2):118-24. PMID: 16864689', 'GSE3541_RAW.tar', 'Oct 31, 2005', 'Mar 03, 2017');

-- Series–samples relationship
INSERT INTO series_samples VALUES
  ('GSE830','GSM12793'),
  ('GSE830','GSM12795'),
  ('GSE830', 'GSM12796'),
  ('GSE830','GSM12794');

-- Datasets (curated summaries) – now point to existing series
INSERT INTO dataset (dataset_ID, title, summary, organism, citation, platform, reference_series, value_type, sample_count)
VALUES
  ('GDS2225', 'Mechanical strain effect on fetal lung type II epithelial cells', 'Analysis of embryonic day 19 fetal lung type II epithelial cells exposed to mechanical strain for 16 hours. Mechanical forces are essential for normal fetal lung development. Results provide insight into the mechanisms regulating lung development in response to mechanical forces.', 'Rattus norvegicus',
   'Wang Y, Maciejewski BS, Weissmann G, Silbert O et al. DNA microarray reveals novel genes induced by mechanical forces in fetal lung type II epithelial cells. Pediatr Res 2006 Aug;60(2):118-24. PMID: 16864689', 'GPL341', 'GSE3541', 'count', 6);

-- Profiles belonging to datasets
INSERT INTO profile (profile_ID, dataset_ID, title, annotation, organism, dataset_type)
VALUES
  ('28483590', 'GDS2225', 'Herpud1 - Mechanical strain effect on fetal lung type II epithelial cells', 'Herpud1, homocysteine inducible ER protein with ubiquitin like domain 1', 'Rattus norvegicus', 'Expression profiling by array, count, 6 samples'),
  ('28487086', 'GDS2225', 'Mt1f - Mechanical strain effect on fetal lung type II epithelial cells', 'Mt1f, metallothionein 1F (multiple annotations exist)', 'Rattus norvegicus', 'Expression profiling by array, count, 6 samples');

-- Profile arrays (expression values within a profile) – now point to valid samples
INSERT INTO profile_array (profile_array_ID, profile_ID, sample_ID, title, value_number, ranking)
VALUES
  ('28483590_1', '28483590', 'GSM581022', 'E19_epithelial cells_control1', 581.1, 76),
  ('28483590_2', '28483590', 'GSM581159', 'E19_epithelial cells_control2', 571.6, 75),
  ('28483590_3', '28483590', 'GSM581160', 'E19_epithelial cells_control3', 488.2, 71),
  ('28483590_4', '28483590', 'GSM581161', 'E19_epithelial cells_strai13', 2306, 93),
  ('28483590_5', '28483590', 'GSM581162', 'E19_epithelial cells_strain2', 1535.1, 90),
  ('28483590_6', '28483590', 'GSM581163', 'E19_epithelial cells_strain3', 1292.6, 88),
  ('28487086_1', '28487086', 'GSM581022', 'E19_epithelial cells_control1', 1747.5, 91),
  ('28487086_2', '28487086', 'GSM581159', 'E19_epithelial cells_control2', 339.8, 65),
  ('28487086_3', '28487086', 'GSM581160', 'E19_epithelial cells_control3', 168.5, 46),
  ('28487086_4', '28487086', 'GSM581161', 'E19_epithelial cells_strai13', 2550.2, 94),
  ('28487086_5', '28487086', 'GSM581162', 'E19_epithelial cells_strain2', 2315.3, 93),
  ('28487086_6', '28487086', 'GSM581163', 'E19_epithelial cells_strain3', 153.1, 43);