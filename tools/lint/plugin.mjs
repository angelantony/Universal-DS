import stylelint from 'stylelint';

const ruleName = 'uds/no-primitive-token';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (name) =>
    `Primitive token ${name} is not allowed in component styles. Use a semantic or component token.`,
});

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
  const primitives = new Set(Array.isArray(primary) ? primary.map(String) : []);
  return (root, result) => {
    if (!primary) return;
    root.walkDecls((declaration) => {
      for (const match of declaration.value.matchAll(/var\(\s*(--uds-[a-z0-9-]+)/g)) {
        const name = match[1];
        if (name && primitives.has(name)) {
          stylelint.utils.report({
            message: messages.rejected(name),
            node: declaration,
            result,
            ruleName,
          });
        }
      }
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.primaryOptionArray = true;

export default stylelint.createPlugin(ruleName, rule);
