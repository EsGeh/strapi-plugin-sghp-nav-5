export default {
  "kind": "collectionType",
  "collectionName": "navigation",
  "info": {
    "singularName": "navigation",
    "pluralName": "navigations",
    "displayName": "Navigation"
  },
  "options": {
    "draftAndPublish": false,
    "comment": ""
  },
 "pluginOptions": {
    "i18n": {
      "localized": true
    },
    "content-manager": {
      "visible": false
    },
    "content-type-builder": {
      "visible": false
    }
  },
  "attributes": {
    "name": {
      "type": "text",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      },
    },
    "items": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "plugin::sghp-nav.item",
      "mappedBy": "master",
    },
  },
}
