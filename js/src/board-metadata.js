export const boardMetadataToText = (metadata, text) => {
  if (typeof text !== 'string') {
    text = '';
  }

  const trimmed = text.trim();
  let spacer = null;

  if (!trimmed.legth) {
    spacer = '';
  } else if (trimmed[trimmed.length - 1] === '.') {
    spacer = ' ';
  } else {
    spacer = '. ';
  }

  if (metadata.type === 'table') {
    return `${text}${spacer}A table pin with ${metadata.rows} rows and ${metadata.cols} columns.`;
  } else if (metadata.type === 'files') {
    return `${text}${spacer}A files pin with ${metadata.extension} extension.`;
  }
  return text;
};

export const boardMetadataFromText = (text) => {
  if (!text) {
    text = '';
  }

  const patterns = {
    table: {
      regex: 'A table pin with ([0-9]+) rows and ([0-9]+) columns',
      metadata: (match) => ({
        type: 'table',
        rows: parseInt(match[1]),
        cols: parseInt(match[2]),
      }),
    },
    files: {
      regex: 'A files pin with ([a-z]+) extension',
      metadata: (match) => ({ type: 'files', extension: match[1] }),
    },
  };

  Object.keys(patterns).forEach((pattern) => {
    if (new RegExp(pattern.regex).test(text)) {
      const matches = new RegExp(pattern.regex).exec(text);

      return pattern.metadata(matches);
    }
  });

  return {};
};

export const boardMetadataRemove = (text) => {
  return text.replace(/A (table|tiles) pin with .*/, '');
};
