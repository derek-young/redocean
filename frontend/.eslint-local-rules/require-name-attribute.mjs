const requireNameAttribute = {
  meta: {
    type: "problem",
    docs: {
      description: "Require the 'name' attribute on interactive elements.",
      recommended: false,
    },
    schema: [],
    messages: {
      missingNameAttribute:
        "<{{element}}> elements must have a 'name' attribute.",
    },
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        const elementName = node.name.name;
        const isInteractiveElement = [
          "input",
          "textarea",
          "select",
          "button",
          "CommandInput",
          "Select",
        ].includes(elementName);

        if (isInteractiveElement) {
          const hasNameAttribute = node.attributes.some(
            (attribute) =>
              attribute.type === "JSXAttribute" &&
              attribute.name.name === "name"
          );

          if (!hasNameAttribute) {
            context.report({
              node: node,
              messageId: "missingNameAttribute",
              data: { element: elementName },
            });
          }
        }
      },
    };
  },
};

export default requireNameAttribute;
