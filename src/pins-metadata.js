export const pinsMergeCustomMetadata = (metadata, customMetadata) => {
  fixedFields = ['rows', 'cols', 'name', 'description'];

  Object.keys(customMetadata).forEach((entry) => {
    if (entry === 'columns') {
      var fixedColumnnFields = ['name', 'type'];

      // convert to list of columns
      if (Array.isArray(metadata['columns'])) {
        metadata['columns'] = metadata['columns'].map((x, i) => {
          return {
            name: Object.keys(metadata['columns'])[i],
            type: metadata['columns'][i],
          };
        });
      }

      if (checks.isDataFrame(customMetadata['columns'])) {
        customMetadata['columns'] < -customMetadata['columns']
          |> jsonlite__toJSON()
          |> jsonlite__fromJSON({ simplifyDataFrame: false });
      }

      customMetadata['columns'].forEach((column) => {
        var foundIdx = metadata$columns.filter(
          (e, i) => metadata['columns'][i]['name'] === column['name']
        );

        if (foundIdx.length == 1) {
          Object.keys(column).forEach((fieldName) => {
            if (!fixedColumnnFields.includes(fieldName)) {
              metadata['columns'][foundIdx][fieldName] = column[fieldName];
            }
          });
        }
      });
    } else if (!fixedFields.includes(entry)) {
      metadata[entry] = customMetadata[entry];
    }
  });

  return metadata;
};
