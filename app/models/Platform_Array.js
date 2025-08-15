"use strict";

const Crud_Basics = require("./Crud_Basics");

class Platform_Array extends Crud_Basics{
    get model(){
        return "platform_array";
    }

    // validation of inputs --> ensure corrent datatypes and so on
    // crud functions can be concentrated in a parent class later on
    validate(record){
        if (!record.gb_acc || typeof record.gb_acc !== 'string'){
            throw new Error("gb_acc must be a non-empty string");
        }
        if (!record.platform_ID || typeof record.platform_ID !== 'string'){
            throw new Error("platform_ID must be a non-empty string");
        }
        for (const field of ['id',
                            'spot_id',
                            'species_scientific_name',
                            'annotation_data',
                            'sequence_type',
                            'target_description',
                            'representative_oublic_id',
                            'gene_title',
                            'gene_symbol',
                            'entrez_gene_id',
                            'refseq_transcript_id',
                            'gene_ontology_biological_process',
                            'gene_ontology_cellular_component',
                            'gene_ontology_molecular_function']){
            if (record[field] !== undefined && typeof record[field] !== 'string'){
                throw new Error(`${field} is not a string`);
            }
        }
        return true;
    }


    // model the relationships
}

module.exports = Platform_Array;