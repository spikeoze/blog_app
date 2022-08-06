export default {
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    {
      name: "name",
      type: "string",
    },
    {
      name: "approved",
      title: "Approved",
      type: "boolean",
      desctiption: "comment won't show without approval",
    },
    {
      name: "email",
      type: "string",
    },
    {
      name: "comment",
      type: "string",
    },

    {
      name: "post",
      type: "reference",
      to: [{ type: "post" }],
    },
  ],
};
