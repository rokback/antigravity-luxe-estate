type Translator = (key: string) => string;

export function buildFormLabels(t: Translator, mode: 'create' | 'edit') {
  return {
    breadcrumbRoot: t('dashboard.properties.form.breadcrumb_root'),
    modeLabel:
      mode === 'create'
        ? t('dashboard.properties.form.title_create')
        : t('dashboard.properties.form.title_edit'),
    title:
      mode === 'create'
        ? t('dashboard.properties.form.title_create')
        : t('dashboard.properties.form.title_edit'),
    subtitle: t('dashboard.properties.form.subtitle'),
    save: t('dashboard.properties.form.save'),
    saving: t('dashboard.properties.form.saving'),
    cancel: t('dashboard.properties.form.cancel'),
    requiredHint: t('dashboard.properties.form.required_hint'),
    sections: {
      basic: t('dashboard.properties.form.section.basic'),
      description: t('dashboard.properties.form.section.description'),
      gallery: t('dashboard.properties.form.section.gallery'),
      location: t('dashboard.properties.form.section.location'),
      details: t('dashboard.properties.form.section.details'),
    },
    fields: {
      title: t('dashboard.properties.form.field.title'),
      price: t('dashboard.properties.form.field.price'),
      status: t('dashboard.properties.form.field.status'),
      type: t('dashboard.properties.form.field.type'),
      description: t('dashboard.properties.form.field.description'),
      address: t('dashboard.properties.form.field.address'),
      latitude: t('dashboard.properties.form.field.latitude'),
      longitude: t('dashboard.properties.form.field.longitude'),
      area: t('dashboard.properties.form.field.area'),
      yearBuilt: t('dashboard.properties.form.field.year_built'),
      beds: t('dashboard.properties.form.field.beds'),
      baths: t('dashboard.properties.form.field.baths'),
      parking: t('dashboard.properties.form.field.parking'),
      amenities: t('dashboard.properties.form.field.amenities'),
    },
    status: {
      sale: t('dashboard.properties.form.status.sale'),
      rent: t('dashboard.properties.form.status.rent'),
      sold: t('dashboard.properties.form.status.sold'),
    },
    types: {
      Apartment: t('dashboard.properties.form.types.apartment'),
      House: t('dashboard.properties.form.types.house'),
      Villa: t('dashboard.properties.form.types.villa'),
      Commercial: t('dashboard.properties.form.types.commercial'),
    },
    amenityLabels: {
      'Swimming Pool': t('filter.amenity_labels.Swimming Pool'),
      Garden: t('dashboard.properties.form.amenities.garden'),
      'Air Conditioning': t('filter.amenity_labels.Air Conditioning'),
      'Smart Home System': t('filter.amenity_labels.Smart Home System'),
      Gym: t('filter.amenity_labels.Gym'),
      Parking: t('filter.amenity_labels.Parking'),
      'High-speed Wifi': t('filter.amenity_labels.High-speed Wifi'),
      'Wine Cellar': t('filter.amenity_labels.Wine Cellar'),
    },
    charsLabel: t('dashboard.properties.form.chars'),
    gallery: {
      dropHint: t('dashboard.properties.form.gallery.drop_hint'),
      maxSize: t('dashboard.properties.form.gallery.max_size'),
      formats: t('dashboard.properties.form.gallery.formats'),
      main: t('dashboard.properties.form.gallery.main_badge'),
      addMore: t('dashboard.properties.form.gallery.add_more'),
      uploading: t('dashboard.properties.form.gallery.uploading'),
      uploadError: t('dashboard.properties.form.errors.upload'),
    },
    map: {
      hint: t('dashboard.properties.form.map.click_hint'),
    },
    errors: {
      saveFailed: t('dashboard.properties.form.errors.save'),
    },
  };
}
