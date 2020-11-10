import * as list from './utils/list';

export function pinsMergeCustomMetadata(metadata, customMetadata) {
  var fixedFields = ['rows', 'cols', 'name', 'description'];

  list.namesArr(customMetadata).forEach((entry) => {
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

      // TODO: Need to convert old-style yaml columns names to new format
      customMetadata['columns'].forEach((column) => {
        var foundIdx = metadata.columns.filter(
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
}
