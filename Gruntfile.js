module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: ['src/head.js', 'src/util.js', 'src/editor.js', 'src/control.js', 'src/tool.js', 'src/jquery.textae.js', 'src/main.js', 'src/tail.js'],
        dest: 'dist/js/textae.js',
      }
    },
    watch: {
      javascript: {
        files: ['Gruntfile.js', 'src/*.js'],
        tasks: ['concat', 'jshint']
      },
      static_files: {
        files: ['dist/textae.html', 'dist/js/textae.js', 'dist/css/*.css'],
        options: {
          livereload: true
        }
      },
    },
    connect: {
      developmentServer: {
        options: {
          middleware: function(connect, options) {
            // Return array of whatever middlewares you want
            return [
              //return static files
              connect.static(options.base),

              //custum methods
              function(req, res, next) {
                if (req.method === "GET") {
                  //return dummy files.
                  res.setHeader("Content-Type", "application/json");
                  path = require("url").parse(req.url).pathname;
                  if (path === "/default.json") {
                    //default config file.
                    res.end('{"span types": [{"color": "#0000FF","name": "Protein","default": false}, {"color": "#FF0000","name": "Cell"}, {"color": "#00FF00","name": "Transcription"}, {"color": "#FFFF00","name": "Gene_expression"}, {"color": "#FF00FF","name": "Negative_regulation"}, {"color": "#00FFFF","name": "Positive_regulation"}, {"color": "#FFFF66","name": "Regulation"}],"relation types": [{"color": "#5CFF0A","name": "locatedAt"}, {"color": "#FF0000","name": "themeOf"}, {"color": "#0000FF","name": "equivalentTo"}], "entity types": [{"color": "#0000FF","name": "Protein","default": true}, {"color": "#FF0000","name": "Cell"}, {"color": "#00FF00","name": "Transcription"}, {"color": "#FFFF00","name": "Gene_expression"}, {"color": "#FF00FF","name": "Negative_regulation"}, {"color": "#00FFFF","name": "Positive_regulation"}, {"color": "#FFFF66","name": "Regulation", "uri":"http://www.yahoo.co.jp"}]}');
                  } else if (path === "/dummy.json") {
                    //dummy annotations files.
                    res.end('{ "text": "Down-regulation of interferon regulatory factor 4 gene expression in leukemic cells due to hypermethylation of CpG motifs in the promoter region Although the bcr-abl translocation has been shown to be the causative genetic aberration in chronic myeloid leukemia (CML), there is mounting evidence that the deregulation of other genes, such as the transcription factor interferon regulatory factor 4 (IRF-4), is also implicated in the pathogenesis of CML. Promoter methylation of CpG target sites or direct deletions/insertions of genes are mechanisms of a reversible or permanent silencing of gene expression, respectively. Therefore, we investigated whether IRF-4 promoter methylation or mutation may be involved in the regulation of IRF-4 expression in leukemia cells. Whereas promoter mutations or structural rearrangements could be excluded as a cause of altered IRF-4 expression in hematopoietic cells, the IRF-4 promoter methylation status was found to significantly influence IRF-4 transcription. First, treatment of IRF-4-negative lymphoid, myeloid and monocytic cell lines with the methylation-inhibitor 5-aza-2-deoxycytidine resulted in a time- and concentration-dependent increase of IRF-4 mRNA and protein levels. Second, using a restriction-PCR-assay and bisulfite-sequencing we identified specifically methylated CpG sites in IRF-4-negative but not in IRF-4-positive cells. Third, we clearly determined promoter methylation as a mechanism for IRF-4 down-regulation via reporter gene assays, but did not detect an association of methylational status and mRNA expression of DNA methyltransferases or methyl-CpG-binding proteins. Together, these data suggest CpG site-specific IRF-4 promoter methylation as a putative mechanism of down-regulated IRF-4 expression in leukemia.", "denotations": [{ "id": "E1", "span": { "begin": 0, "end": 15 }, "obj": null }, { "id": "T1", "span": { "begin": 19, "end": 49 }, "obj": "Cell" }, { "id": "E2", "span": { "begin": 55, "end": 65 }, "obj": "Gene_expression" }, { "id": "T2", "span": { "begin": 158, "end": 161 }, "obj": "Protein" }, { "id": "T3", "span": { "begin": 162, "end": 165 }, "obj": "Protein" }, { "id": "E3", "span": { "begin": 305, "end": 317 }, "obj": "Regulation" }, { "id": "T4", "span": { "begin": 367, "end": 397 }, "obj": "Protein" }, { "id": "T5", "span": { "begin": 399, "end": 404 }, "obj": "Protein" }, { "id": "T6", "span": { "begin": 658, "end": 663 }, "obj": "Protein" }, { "id": "E4", "span": { "begin": 720, "end": 730 }, "obj": "Regulation" }, { "id": "T7", "span": { "begin": 734, "end": 739 }, "obj": "Protein" }, { "id": "E5", "span": { "begin": 740, "end": 750 }, "obj": "Gene_expression" }, { "id": "E6", "span": { "begin": 858, "end": 865 }, "obj": "Regulation" }, { "id": "T8", "span": { "begin": 866, "end": 871 }, "obj": "Protein" }, { "id": "E7", "span": { "begin": 872, "end": 882 }, "obj": "Gene_expression" }, { "id": "T9", "span": { "begin": 911, "end": 916 }, "obj": "Protein" }, { "id": "E8", "span": { "begin": 972, "end": 981 }, "obj": "Regulation" }, { "id": "T10", "span": { "begin": 982, "end": 987 }, "obj": "Protein" }, { "id": "E9", "span": { "begin": 988, "end": 1001 }, "obj": "Transcription" }, { "id": "T11", "span": { "begin": 1023, "end": 1028 }, "obj": "Protein" }, { "id": "E10", "span": { "begin": 1029, "end": 1037 }, "obj": "Gene_expression" }, { "id": "E11", "span": { "begin": 1134, "end": 1142 }, "obj": "Positive_regulation" }, { "id": "E12", "span": { "begin": 1182, "end": 1190 }, "obj": "Positive_regulation" }, { "id": "T12", "span": { "begin": 1194, "end": 1199 }, "obj": "Protein" }, { "id": "T13", "span": { "begin": 1339, "end": 1344 }, "obj": "Protein" }, { "id": "E13", "span": { "begin": 1345, "end": 1353 }, "obj": "Gene_expression" }, { "id": "T14", "span": { "begin": 1365, "end": 1370 }, "obj": "Protein" }, { "id": "E14", "span": { "begin": 1371, "end": 1379 }, "obj": "Gene_expression" }, { "id": "T15", "span": { "begin": 1456, "end": 1461 }, "obj": "Protein" }, { "id": "E15", "span": { "begin": 1462, "end": 1477 }, "obj": "Negative_regulation" }, { "id": "T16", "span": { "begin": 1687, "end": 1692 }, "obj": "Protein" }, { "id": "E16", "span": { "begin": 1741, "end": 1755 }, "obj": "Negative_regulation" }, { "id": "T17", "span": { "begin": 1756, "end": 1761 }, "obj": "Protein" }, { "id": "E17", "span": { "begin": 1762, "end": 1772 }, "obj": "Gene_expression" }, { "id": "E18", "span": { "begin": 69, "end": 77 }, "obj": "Gene_expression" }, { "id": "E19", "span": { "begin": 91, "end": 107 }, "obj": "Protein" }, { "id": "E20", "span": { "begin": 91, "end": 107 }, "obj": "Gene_expression" }, { "id": "E21", "span": { "begin": 50, "end": 54 }, "obj": "Protein" }], "relations": [{ "id": "R1", "pred": "locatedAt", "subj": "E1", "obj": "T1" },{ "id": "R2", "pred": "themeOf", "subj": "E2", "obj": "T2" },{ "id": "R3", "pred": "equivalentTo", "subj": "E3", "obj": "T3" }] }');
                  }
                } else if (req.method === "POST") {
                  //save file as url path.
                  console.log("[200] " + req.method + " to " + req.url);
                  var fullBody = '';

                  req.on('data', function(chunk) {
                    fullBody += chunk.toString();
                  });

                  req.on('end', function() {
                    // parse the received body data
                    var decodedBody = require('querystring').parse(fullBody);
                    require("fs").writeFile(req.url.substr(1), decodedBody.annotations);

                    // end response
                    res.end();
                  });
                }
              }
            ];
          },
        },
      }
    },
    qunit: {
      all: 'test/util.html'
    },
    jshint: {
      files: ['src/*.js'],
      options: {
        ignores: ['src/head.js', 'src/tail.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
};