const SNIPPET_REGEX = /^```(\S+)([^]*?)```$/mi;
const ALL_SNIPPETS_REGEX = new RegExp(SNIPPET_REGEX.source, 'mig');
const LANGUAGE_LABELS = Object.freeze({
  js: 'JavaScript',
  html: 'HTML',
  py: 'Python',
  r: 'R',
});

const parseSnippet = (text) => {
  const match = text.match(SNIPPET_REGEX);

  if (!match) throw new Error('Multilang: Code snippet must have a language set.');

  const [, lang, value] = match;
  const label = LANGUAGE_LABELS[lang] || lang;

  return { lang, value, label };
};

const parseSnippets = (text) => {
  return text
    .match(ALL_SNIPPETS_REGEX)
    .map(parseSnippet);
};

const renderTabs = (snippets) => {
  if (!snippets && !snippets.length) return [];

  const tabs = [];
  const values = snippets.map(({ lang, label }) => ({ label, value: lang }));

  tabs.push({
    type: 'jsx',
    value: `
      <Tabs
        groupId="multilang-plugin"
        defaultValue="${snippets[0].lang}"
        values={${JSON.stringify(values)}}
      >
    `,
  });

  snippets.forEach(({ lang, value }) => {
    tabs.push({ type: 'jsx', value: `<TabItem value="${lang}">` });
    tabs.push({ lang, value, type: 'code' });
    tabs.push({ type: 'jsx', value: '</TabItem>' });
  });

  tabs.push({ type: 'jsx', value: '</Tabs>' });

  return tabs;
};

module.exports = () => {
  return (tree) => {
    const { children } = tree;
    const isPluginUsed = children.reduce((isUsed, child, index) => {
      const isMultilang = child.type === 'code' && child.lang === 'multilang';

      if (isMultilang) {
        const snippets = parseSnippets(child.value.trim());
        const tabs = renderTabs(snippets);

        children.splice(index, 1, ...tabs);
      }

      return isUsed || isMultilang;
    }, false);

    if (isPluginUsed) {
      children.unshift({
        type: 'import',
        value: "import TabItem from '@theme/TabItem';",
      });

      children.unshift({
        type: 'import',
        value: "import Tabs from '@theme/Tabs';",
      });
    }
  };
};
