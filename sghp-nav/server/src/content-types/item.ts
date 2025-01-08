export default {
  "kind": "collectionType",
  "collectionName": "item",
  "info": {
    "singularName": "item",
    "pluralName": "items",
    "displayName": "NavigationItem"
  },
  "options": {
    "draftAndPublish": false,
    "comment": ""
  },
 "pluginOptions": {
    "content-manager": {
      "visible": true
    },
    "content-type-builder": {
      "visible": true
    }
  },
  "attributes": {
    "title": {
      "type": "text"
    },
    "path": {
      "type": "string",
    },
    order: {
      type: "integer",
      default: 0,
    },
    "subItems": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "plugin::sghp-nav.item",
      "mappedBy": "parent"
    },
    "parent": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::sghp-nav.item",
      "inversedBy": "subItems"
    },
    "master": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::sghp-nav.navigation",
      "inversedBy": "items"
    }
  },
}
