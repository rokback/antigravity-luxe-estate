export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  priceSuffix?: string;
  beds: number;
  baths: number;
  area: number;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  type: 'sale' | 'rent';
}

export const featuredProperties: Property[] = [
  {
    id: 'f1',
    title: 'The Glass Pavilion',
    location: 'Beverly Hills, California',
    price: 5250000,
    beds: 5,
    baths: 4.5,
    area: 4200,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCra-FKp81t0_OM8bWD55m2o9OOSnR_v7D0UilyExMImxyIcr9tIMZ2Py3HcC0ra_MtSsBkduMcwxUNKI9_iSXFFr_YRON1SF9hNM3fcYy-uG7N7uusL0Z367WINi1V7_GwfNQx-gsbUqLtzVi4ivFyqFQGb4qBs79bALeSFb6i3_ZnJnI1VVrN-VeZYHjfYyQI5C6zy90N3uxWZpwzIBhNoUDKKQjQ8EOEYPoyPTzhnh6b6AS3dkkFJ8t4xSDC6qjhMrQUoUPnAeM',
    imageAlt: 'Luxury modern villa exterior with pool',
    badge: 'Exclusive',
    type: 'sale'
  },
  {
    id: 'f2',
    title: 'Azure Heights Penthouse',
    location: 'Downtown, Vancouver',
    price: 3800000,
    beds: 3,
    baths: 3,
    area: 2100,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDurAGHzg_fpQxFal-obkFVy1Q3WLPdueAQpz0itcQiRV-WfvulnBEDJbNeV8J06q4mX7PTtXYVJjX4-mHVr_khZLZxQ_s8f6fruGqzeqALyMu8wEHRK1EsOs9f4_jPmS7FxcdzrDkR88Wz0GjaPLXkTZRoJQfur59rxYRLi-WYcW-VU_gKS39CPLOMlftvqGvW0IOk5tXgst5mJ4WQM-ICN4vkdel9ido9YFUQga0OI10i6NSe5W4owt33-2YRi_b_ltdZW2QZC5s',
    imageAlt: 'Modern interior living room with view',
    badge: 'New Arrival',
    type: 'sale'
  }
];

export const newProperties: Property[] = [
  {
    id: 'n1',
    title: 'Modern Family Home',
    location: '123 Pine St, Seattle',
    price: 850000,
    beds: 3,
    baths: 2,
    area: 120,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuQ9M7U6euA6_cXmYuXnej-N5IuawAW8ds-4G1mzfqmiBc13qXsPhf9_j_zTB8gfEunrBHo8xMsxYwCw_pl8fsxbxRkmyvLR1N9Tiye5ZJG7fwlLn9MwyBanXYhE0emGwp59es1FEyQTRQbmXLUKO74Yj34ZHqrqIkOtMKhP8CmRFvfoHT5LAe10105vUhKNkxIBvtt530nfLigSUTemOOcJMVNmsgactntRJUwOBU_TZzND7BYtDklr8uZcNYlQOK5U74-ufIf-E',
    imageAlt: 'Modern white house facade',
    type: 'sale'
  },
  {
    id: 'n2',
    title: 'Urban Loft',
    location: '456 Elm Ave, Portland',
    price: 3200,
    priceSuffix: '/mo',
    beds: 1,
    baths: 1,
    area: 85,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4zNatD3vePhIZAi6OHHJKmamYSgeBNSKjEt32tvkkf4s6aBXCF8R4LNfDfPa9leA0t6N1OKOcP358WwZrnosbCBxSM7EaY2_P7qkx3MinRgmHQn7RvleNTwy8cLigMoR3iv0u83chBVbZYI6BcNMcqv80W-l1pIUgIWZcDIXEqtUatrsojSGfM0lTNDZpkBntBUkRY6NB4ZUymYNYvTHXKbO8NZ6N6uoyuuHqcaRWKzHCNXkOR3p-_EVFAHR8QwijIY_m1mefPZ4',
    imageAlt: 'Stylish apartment living room',
    type: 'rent'
  },
  {
    id: 'n3',
    title: 'Highland Retreat',
    location: '789 Mountain Rd, Bend',
    price: 620000,
    beds: 2,
    baths: 2,
    area: 98,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARQWC19e7mleUpjb8CWLztEv_svJeRFOaC2i-9r9GctFuX5Barzhfai9wNM1WW8bcGlqdFM32d3KPf7SItom5ijdHOz5rGGQPeT7PlWs8-y9LkfcsHLQqsLxalhxP94XJo76_mAMp7T2dVj3hPKHNzTDLLiS6ujSdSsyo3onxQthp4ZkVE8op92gyTLUUucaGaxO8vJvyhH3HuWB07EPqT1WsW0lr9Of5lUPonjG9eiqE1XiJXTqzXUZQt5JorfPwCO1MioZA_Zro',
    imageAlt: 'Cabin in the woods exterior',
    type: 'sale'
  },
  {
    id: 'n4',
    title: 'Sea View Penthouse',
    location: '321 Ocean Dr, Miami',
    price: 4500,
    priceSuffix: '/mo',
    beds: 3,
    baths: 3,
    area: 180,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGq4Phm0uDzCnjHAsnWpYTBVpOds_M6iOsJuRQQA5eUZHkztGgtc7eh_OE6wBeyW1-iZh7yyhROnvvmqkAZ9tyAWFGXk0FG52zU4kZ_EDLA0U0cRszy7byNXTeWe0_hS53SYmtCTEV8Y1AM-WxiIC38UMa15QwFDjXtCGQOxoh35K0Ol_70vfsxm0VqDbaWkr8tcEbLTLy0NXH_GcpGK4lAXizgxYOIlFWGyau-4OIfPZRpjCBDbz_qu3VlN201UUJGiuM9ajVd-U',
    imageAlt: 'Bright bedroom with large window',
    type: 'rent'
  },
  {
    id: 'n5',
    title: 'Central Studio',
    location: '555 Main St, Chicago',
    price: 550000,
    beds: 1,
    baths: 1,
    area: 50,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1w-Hb1289NqZKon3VK8bpmMiCDYYiAMT5egzTINo9m9wSZRHv-k-1IGTVoL1NT8YeZXJHa87JPNDIPrtrbP7jChHq0ypXF90uByhC6VA9O788_B4FY8JVg4chbWN9bcrn9-9FvVvfZX8Aj60Iqg_C8CsCA9DEnJqi2rJvzmK5UP5z-9XRTRjBneAPCa8iGgGWBD9yYKsziN6vn0ePBDGo3inieQtmbr46W31p6UfQ649XRxTm7ygOY2J-jxW1r0qWs8i97KGpkTE',
    imageAlt: 'Cozy apartment interior',
    type: 'sale'
  },
  {
    id: 'n6',
    title: 'Garden Villa',
    location: '999 Oak Ln, Austin',
    price: 2800,
    priceSuffix: '/mo',
    beds: 2,
    baths: 2,
    area: 110,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfGXdY0g51ojSg0GMeTW9ndLY3mpKK3oMtWxo2nwd_dwi1pgn1Boi_ovaDGIFhUA7nwu3WdBch8ZuHxoHu3QfgM5ceAsp8pglRVyCROWNcy9zeDNP2wqLoevyKGcaEyFYHYpIx2KK46nLWthnHiHugmkKw48kJsL8IjMO1bL3T1Zwt8bvQDTTUHTgB3GqZ2RU2asRzF1jVg0rLw3LWXXTq0YF1CsbhlWpYOuCEpH5bB8zkBlbKXR4At_M46AL8rJqn5c6BrPD5PP8',
    imageAlt: 'Modern minimalist home exterior',
    type: 'rent'
  },
  {
    id: 'n7',
    title: 'Sunny Lakeside House',
    location: 'Evergreen Terrace, Tahoe',
    price: 1250000,
    beds: 4,
    baths: 3,
    area: 250,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Modern house with swimming pool',
    type: 'sale'
  },
  {
    id: 'n8',
    title: 'Minimalist Apartment',
    location: '100 Broadway, New York',
    price: 4500,
    priceSuffix: '/mo',
    beds: 1,
    baths: 1,
    area: 75,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Minimalist apartment interior',
    type: 'rent'
  },
  {
    id: 'n9',
    title: 'Historic Townhouse',
    location: '72 Beacon St, Boston',
    price: 2100000,
    beds: 3,
    baths: 2.5,
    area: 180,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Historic townhouse exterior',
    type: 'sale'
  },
  {
    id: 'n10',
    title: 'Desert Oasis',
    location: 'Camelback Rd, Scottsdale',
    price: 5200,
    priceSuffix: '/mo',
    beds: 3,
    baths: 3,
    area: 210,
    imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Desert house at sunset',
    type: 'rent'
  },
  {
    id: 'n11',
    title: 'Downtown Condo',
    location: '150 4th Ave, Nashville',
    price: 495000,
    beds: 2,
    baths: 2,
    area: 95,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Modern condo interior',
    type: 'sale'
  },
  {
    id: 'n12',
    title: 'Oceanfront Villa',
    location: 'Pacific Coast Hwy, Malibu',
    price: 8500000,
    beds: 5,
    baths: 6,
    area: 550,
    imageUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Luxury villa by the ocean',
    type: 'sale'
  },
  {
    id: 'n13',
    title: 'Cozy Mountain Cabin',
    location: 'Eagle Drive, Aspen',
    price: 3600,
    priceSuffix: '/mo',
    beds: 2,
    baths: 1.5,
    area: 105,
    imageUrl: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Cabin in snowy mountains',
    type: 'rent'
  },
  {
    id: 'n14',
    title: 'Contemporary Estate',
    location: 'Hidden Hills, California',
    price: 4200000,
    beds: 4,
    baths: 4.5,
    area: 480,
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Contemporary modern house',
    type: 'sale'
  },
  {
    id: 'n15',
    title: 'Riverside Loft',
    location: '12 Waterway, Chicago',
    price: 2800,
    priceSuffix: '/mo',
    beds: 1,
    baths: 1,
    area: 88,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1f5139031c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Industrial style loft',
    type: 'rent'
  },
  {
    id: 'n16',
    title: 'Suburban Retreat',
    location: 'Maple Wood, New Jersey',
    price: 780000,
    beds: 4,
    baths: 3,
    area: 220,
    imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Suburban house with front yard',
    type: 'sale'
  }
];
