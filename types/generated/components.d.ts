import type { Schema, Attribute } from '@strapi/strapi';

export interface AttributeSetsLaptopAttributes extends Schema.Component {
  collectionName: 'components_attribute_sets_laptop_attributes';
  info: {
    displayName: 'Laptops';
    description: '';
  };
  attributes: {
    Tip_procesor: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 35;
      }>;
    Memorie_RAM: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 35;
      }>;
  };
}

export interface AttributeSetsPcComponents extends Schema.Component {
  collectionName: 'components_attribute_sets_pc_components';
  info: {
    displayName: 'PC Components';
  };
  attributes: {
    tip_procesor: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 35;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'attribute-sets.laptop-attributes': AttributeSetsLaptopAttributes;
      'attribute-sets.pc-components': AttributeSetsPcComponents;
    }
  }
}
