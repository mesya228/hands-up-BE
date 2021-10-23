export const getNumber = () => {
  return testNumbers[0];
  return testNumbers[Math.floor(Math.random() * (testNumbers.length))];
}

export const testNumbers = [
  {
    "success": true,
    "plate": "1354ХОЕ",
    "plate_en": "1354XOE",
    "is_electric": false,
    "ads_free": true,
    "photo_token": "roEg2hkO3BIcvob2",
    "image": {
        "exact_color": false,
        "url": null,
        "logo": null
    },
    "suggested": [],
    "plate_countries": [],
    "unicards": [
        {
            "id": "gov_registration",
            "title": "Гос. регистрация",
            "subtitle": "Украина",
            "message": "Не найдено информации о данном номере,\nна период с 2013-01-01 до 2021-07-31",
            "info": "Выполняется проверка транспортного средства по базе МВД.\n        \nОбратите внимание, что база МВД доступна лишь с 1 января 2013 года, что существено ограничиват результат поиска.\n        \nУказанная стоимость автомобиля является средней для данной модели этого же года и не учитывает особенностей конкретно этого авто.\n        \nОсновной источник информации реестр МВД на data.gov.ua",
            "location": {},
            "properties": [],
            "properties_horizontal": [],
            "photos": [],
            "whitelisted": []
        },
        {
            "id": "wanted",
            "title": "Розыск",
            "subtitle": "Украина",
            "message": "Авто с этим номером находится в угоне!",
            "message_color": "d0020c",
            "info": "Выполняется проверка транспортного средства по актуальной базе розыска МВД.\n        \nОтображает краткую информацию о транспортном средстве, если он числится в розыске.\n        \nОсновной источник информации реестр МВД на data.gov.ua",
            "brand": "ДНЕПР-11",
            "model": "ДНЕПР 11",
            "location": {
                "address": "ГЕНІЧЕСЬКИЙ ВІДДІЛ ПОЛІЦІЇ ГУ НП В ХЕРСОНСЬКІЙ ОБЛАСТІ",
                "label": "Орган внутренних дел",
                "icon": "ic_police_station",
                "zoom": 15
            },
            "properties": [
                {
                    "icon": "ic_calendar",
                    "label": "Дата кражи",
                    "value": "2021-08-28"
                },
                {
                    "icon": "ic_rgb",
                    "label": "Цвет",
                    "value": "ЧЕРНЫЙ"
                },
                {
                    "icon": "ic_license_plate",
                    "label": "Гос. номер",
                    "value": "1354XOE"
                },
                {
                    "icon": "ic_engine",
                    "label": "Номер двигателя",
                    "value": "871183"
                },
                {
                    "icon": "ic_barcode",
                    "label": "VIN",
                    "value": "4***34<br><small>Доступно после авторизации</small><b></b>",
                    "is_large": true,
                    "whitelisted": true,
                    "lock": true,
                    "action": "auth"
                }
            ],
            "properties_horizontal": [],
            "photos": [],
            "whitelisted": []
        }
    ]
  },
  {
    "success": true,
    "plate": "АН8822АС",
    "plate_en": "AH8822AC",
    "plate_cost": 12000,
    "plate_cost_reason": "Дві послідовні пари однакових цифр",
    "is_electric": false,
    "ads_free": true,
    "photo_token": "bCWpJDPdj5DjxPef6g==",
    "image": {
        "exact_color": false,
        "url": null,
        "logo": null
    },
    "suggested": [],
    "plate_countries": [
        "ua"
    ],
    "unicards": [
        {
            "id": "gov_registration",
            "title": "Гос. регистрация",
            "message": "Не найдено информации о данном номере,\nна период с 2013-01-01 до 2021-07-31",
            "info": "Выполняется проверка транспортного средства по базе МВД.\n        \nОбратите внимание, что база МВД доступна лишь с 1 января 2013 года, что существено ограничиват результат поиска.\n        \nУказанная стоимость автомобиля является средней для данной модели этого же года и не учитывает особенностей конкретно этого авто.\n        \nОсновной источник информации реестр МВД на data.gov.ua",
            "location": {},
            "properties": [
                {
                    "icon": "AH",
                    "label": "Регион",
                    "value": "Дoнeцкaя облacть",
                    "is_large": true,
                    "color": "ffffff"
                },
                {
                    "icon": "ic_license_plate",
                    "label": "Стоимость номера",
                    "value": "12000 грн.<br><small>Дві послідовні пари однакових цифр</small><b></b>",
                    "is_large": true
                }
            ],
            "properties_horizontal": [],
            "photos": [],
            "whitelisted": []
        },
        {
            "id": "wanted",
            "title": "Розыск",
            "message": "Авто с этим номером находится в угоне!",
            "message_color": "d0020c",
            "info": "Выполняется проверка транспортного средства по актуальной базе розыска МВД.\n        \nОтображает краткую информацию о транспортном средстве, если он числится в розыске.\n        \nОсновной источник информации реестр МВД на data.gov.ua",
            "brand": "VIPER",
            "model": "ACTIVE ZS50",
            "location": {
                "address": "МИРНОГРАДСЬКЕ ВІДДІЛЕННЯ ПОЛІЦІЇ ПОКРОВСЬКОГО ВІДДІЛУ ГУНП В ДОНЕЦЬКІЙ ОБЛ.",
                "label": "Орган внутренних дел",
                "icon": "ic_police_station",
                "zoom": 15
            },
            "properties": [
                {
                    "icon": "ic_calendar",
                    "label": "Дата кражи",
                    "value": "2021-08-28"
                },
                {
                    "icon": "ic_rgb",
                    "label": "Цвет",
                    "value": "КОРИЧНЕВЫЙ"
                },
                {
                    "icon": "ic_license_plate",
                    "label": "Гос. номер",
                    "value": "AH8822AC"
                }
            ],
            "properties_horizontal": [],
            "photos": [],
            "whitelisted": []
        },
        {
            "id": "owner",
            "title": "Владелец",
            "message": "Не найдено информации о данном номере",
            "location": {},
            "properties": [],
            "properties_horizontal": [],
            "photos": [],
            "whitelisted": []
        }
    ],
    "promo_button": {
        "url": "https://polis.carplates.app",
        "title": "Купить страховку",
        "icon": "ic_insurance"
    }
  },
  {
    "success": true,
    "plate": "КА7770НР",
    "plate_en": "KA7770HP",
    "color": "ЧЕРНЫЙ",
    "plate_cost": 12000,
    "plate_cost_reason": "Три цифры одинаковые и расположены подряд",
    "is_electric": false,
    "ads_free": true,
    "photo_token": "v6mhPM9NMuJJofqKDzTtzq3IqIKt5Dm7I0+begNX9au5aQ+mv5AdnZaEuZw=",
    "image": {
        "exact_color": true,
        "logo": "https://cars.ams3.cdn.digitaloceanspaces.com/logo/mercedes.png"
    },
    "suggested": [],
    "plate_countries": [
        "ua"
    ],
    "is_payment_required": true,
    "unicards": [
        {
            "id": "gov_registration",
            "is_payment_required": true,
            "title": "Гос. регистрация",
            "message": "Свежая регистрация",
            "message_color": "009a00",
            "info": "Выполняется проверка транспортного средства по базе МВД.\n        \nОбратите внимание, что база МВД доступна лишь с 1 января 2013 года, что существено ограничиват результат поиска.\n        \nУказанная стоимость автомобиля является средней для данной модели этого же года и не учитывает особенностей конкретно этого авто.\n        \nОсновной источник информации реестр МВД на data.gov.ua",
            "brand": "MERCEDES-BENZ",
            "model": "G 63 AMG",
            "make_year": 2012,
            "price": {
                "value": "≈ 92000",
                "currency": "$",
                "is_whitelisted": true
            },
            "location": {},
            "properties": [
                {
                    "icon": "KA",
                    "label": "Регион",
                    "value": "Город Киев",
                    "is_large": true,
                    "color": "ffffff",
                    "whitelisted": true
                },
                {
                    "icon": "ic_license_plate",
                    "label": "Стоимость номера",
                    "value": "12000 грн.<br><small>Три цифры одинаковые и расположены подряд</small><b></b>",
                    "is_large": true,
                    "whitelisted": true
                },
                {
                    "icon": "ic_calendar",
                    "label": "Дата первой регистрации",
                    "value": "$%$$-%$-%$",
                    "is_large": true
                },
                {
                    "icon": "ic_barcode",
                    "label": "VIN",
                    "value": "WDB4********04082<br><small>Доступно после авторизации</small><b></b>",
                    "is_large": true,
                    "action": "auth",
                    "whitelisted": true,
                    "lock": true
                },
                {
                    "icon": null,
                    "value": "Последняя запись",
                    "is_large": true,
                    "whitelisted": true
                },
                {
                    "icon": "ic_calendar",
                    "label": "Дата записи",
                    "value": "#$%$-*#-$#",
                    "is_large": false
                },
                {
                    "icon": "ic_license_plate",
                    "label": "Гос. номер",
                    "value": "KA7770HP",
                    "is_large": false,
                    "whitelisted": true
                },
                {
                    "icon": "ic_record",
                    "label": "Запись",
                    "value": "#*%##*##*#%%$#* #$ $%*$%% #***#%%*# ** #%%. %%*$$-#%#**#$ ($*)",
                    "is_large": true
                }
            ],
            "properties_horizontal_title": "Параметры:",
            "properties_horizontal": [
                {
                    "icon": "ic_rgb",
                    "label": "Цвет",
                    "value": "ЧЕРНЫЙ",
                    "whitelisted": true
                },
                {
                    "icon": "ic_car",
                    "label": "Тип",
                    "value": "ЛЕГКОВОЙ",
                    "whitelisted": true
                },
                {
                    "icon": "ic_fuel",
                    "label": "Топливо",
                    "value": "БЕНЗИН",
                    "whitelisted": true
                },
                {
                    "icon": "ic_engine",
                    "label": "Объем двигателя",
                    "value": "5461",
                    "whitelisted": true
                }
            ],
            "details": {
                "label": "История регистрации",
                "lock": true,
                "properties": [
                    {
                        "value": "Доступно после покупки",
                        "is_whitelisted": true
                    }
                ]
            },
            "photos": [],
            "whitelisted": [
                "location"
            ]
        },
        {
            "id": "wanted",
            "title": "Розыск",
            "message": "Авто с этим номером не находится в угоне",
            "message_color": "009a00",
            "info": "Выполняется проверка транспортного средства по актуальной базе розыска МВД.\n        \nОтображает краткую информацию о транспортном средстве, если он числится в розыске.\n        \nОсновной источник информации реестр МВД на data.gov.ua",
            "location": {},
            "properties": [],
            "properties_horizontal": [],
            "photos": [],
            "whitelisted": []
        },
        {
            "id": "check_for_encumbrance",
            "is_payment_required": true,
            "title": "Проверка на арест",
            "message": "Проверка на наличие ареста, проводится после покупки отчёта",
            "info": "В случае наложения ареста на автомобиль, будет невозможно осуществить регистрационные действия.\n        \nПроводится проверка на наличие ограничений по Государственному реестру обременений движимого имущество (ДРОРМ)",
            "location": {},
            "properties": [
                {
                    "icon": "ic_files",
                    "value": "Отчёт <b>ДРОРМ</b><br><small>• Судебные аресты<br>• Кредитные залоги<br>• Долговые обязательства<br>• Ограничения, налагаемые гос. органами</small><b></b>",
                    "is_large": true,
                    "lock": true,
                    "whitelisted": true
                }
            ],
            "properties_horizontal": [],
            "photos": [],
            "whitelisted": []
        },
        {
            "id": "owner",
            "title": "Владелец",
            "info": "Это вся информация которую МВД распространяет про владельца, так-как другие данные являются персональными.\n        \nОсновной источник информации реестр МВД на data.gov.ua",
            "location": {},
            "properties": [
                {
                    "icon": "ic_id_card",
                    "value": "Неизвестно<br><small>Данные будут доступны в начале следующего месяца</small><b></b>",
                    "is_large": true
                }
            ],
            "properties_horizontal": [],
            "photos": [],
            "whitelisted": []
        },
        {
            "id": "insurance",
            "is_payment_required": false,
            "title": "Страховка",
            "message": "Актуально на: 2021-08-26",
            "info": "Данные о последнем (активном или не активном) страховом полисе ОСАГО (Автогражданка) по данному номеру транспортного средства.\n        \nПолис обязателен для всех владельцев авто, зарегистрированных в Украине, но это не означает что все его покупают.\n        \nОбратите внимания, что информация может быть не актуальной, даже если страховой полис активный.\n        \nОтображаемые данные иногда могут содержать ошибки, так-как при оформлении ОСАГО вся информация заполняется вручную и могла быть заполнена не внимательно.",
            "brand": "Mercedes-Benz G63",
            "location": {},
            "properties": [
                {
                    "icon": "ic_record",
                    "label": "Статус",
                    "value": "Действующая"
                },
                {
                    "icon": "ic_license_plate",
                    "label": "Гос. номер",
                    "value": "KA7770HP"
                },
                {
                    "icon": "ic_insurance",
                    "label": "Номер полиса",
                    "value": "205286845",
                    "is_large": true
                },
                {
                    "icon": "ic_barcode",
                    "label": "VIN",
                    "value": "WDB4********04082<br><small>Доступно после авторизации</small><b></b>",
                    "is_large": true,
                    "whitelisted": true,
                    "lock": true,
                    "action": "auth"
                },
                {
                    "icon": "ic_record",
                    "label": "Страховщик",
                    "value": "АТ \"СК \"ІНГО\"\n+38 (044) 490-27-44,(044) 490-27-45\noffice@ingo.ua\nм. Київ, вул. Бульварно-Кудрявська, 33",
                    "is_large": true
                }
            ],
            "properties_horizontal": [],
            "photos": [],
            "whitelisted": []
        },
        {
            "id": "vin_decode",
            "title": "Расшифровка VIN",
            "brand": "Mercedes-Benz",
            "model": "G 63 AMG",
            "make_year": 2013,
            "location": {},
            "properties": [
                {
                    "icon": "ic_earth_globe",
                    "label": "Изготовлено в",
                    "value": "Europe\nГермания\nD-70546 Stuttgart\nMercedesstrasse 137",
                    "is_large": true
                },
                {
                    "icon": "ic_car",
                    "label": "Кузов",
                    "value": "5 Doors Off Road"
                },
                {
                    "icon": "ic_barcode",
                    "label": "VIN",
                    "value": "WDB4********04082<br><small>Доступно после авторизации</small><b></b>",
                    "is_large": true,
                    "whitelisted": true,
                    "lock": true,
                    "action": "auth"
                }
            ],
            "properties_horizontal": [
                {
                    "icon": "ic_gearshift",
                    "label": "Трансмиссия",
                    "value": "7-Speed Automatic",
                    "is_large": true
                },
                {
                    "icon": "ic_engine",
                    "label": "Двигатель",
                    "value": "5.5L V8 SOHC AWD",
                    "is_large": true
                },
                {
                    "icon": "ic_fuel",
                    "label": "Топливо",
                    "value": "Бензин"
                },
                {
                    "icon": "ic_speedometer",
                    "label": "Лошадиная сила (л.с.)",
                    "value": "571"
                },
                {
                    "icon": "ic_seating",
                    "label": "Сидячих мест",
                    "value": "5"
                }
            ],
            "photos": [],
            "whitelisted": []
        }
    ],
    "promo_button": {
        "url": "https://polis.carplates.app",
        "title": "Купить страховку",
        "icon": "ic_insurance"
    }
  },
  {
    ads_free: true,
    color: "КРАСНЫЙ",
    image: {
      exact_color: true,
      logo: "https://cars.ams3.cdn.digitaloceanspaces.com/logo/tesla.png"
    },
    is_electric: false,
    is_payment_required: false,
    is_purchased: true,
    is_refresh_required: false,
    photo_token: "EJNAlRumBl4peCkMWCqzDuWp",
    plate: "АА9999ТС",
    plate_cost: 36000,
    plate_cost_reason: "Четыре одинаковые цифры",
    plate_countries: ["ua"],
    plate_en: "AA9999TC",
    promo_button: {
      url: "https://polis.carplates.app",
      title: "Купить страховку",
      icon: "ic_insurance"
    },
    success: true,
    suggested: [],
    unicards: [
      {
        "id": "gov_registration",
        "is_payment_required": false,
        "title": "Гос. регистрация",
        "info": "Выполняется проверка транспортного средства по базе МВД.\n        \nОбратите внимание, что база МВД доступна лишь с 1 января 2013 года, что существено ограничиват результат поиска.\n        \nУказанная стоимость автомобиля является средней для данной модели этого же года и не учитывает особенностей конкретно этого авто.\n        \nОсновной источник информации реестр МВД на data.gov.ua",
        "brand": "TESLA",
        "model": "MODEL X",
        "make_year": 2017,
        "price": {
          "value": "≈ 59300",
          "currency": "$",
          "is_whitelisted": true
        },
        "location": {
          "address": "04128, м. Київ, вул. Туполєва, 19",
          "location": "ТСЦ 8041",
          "whitelisted": true,
          "label": "Сделана в департаменте",
          "icon": "ic_map",
          "zoom": 15
        },
        "properties": [
          {
            "icon": "AA",
            "label": "Регион",
            "value": "Город Киев",
            "is_large": true,
            "color": "ffffff"
          },
          {
            "icon": "ic_license_plate",
            "label": "Стоимость номера",
            "value": "36000 грн.<br><small>Четыре одинаковые цифры</small><b></b>",
            "is_large": true
          },
          {
            "icon": "ic_calendar",
            "label": "Дата первой регистрации",
            "value": "2018-11-09",
            "is_large": true
          },
          {
            "icon": "ic_barcode",
            "label": "VIN",
            "value": "5YJXCBE2XHF043074",
            "is_large": true,
            "whitelisted": true
          },
          {
            "icon": null,
            "value": "Последняя запись",
            "is_large": true
          },
          {
            "icon": "ic_calendar",
            "label": "Дата записи",
            "value": "2018-11-09",
            "is_large": false
          },
          {
            "icon": "ic_license_plate",
            "label": "Гос. номер",
            "value": "AA9999TC",
            "is_large": false
          },
          {
            "icon": "ic_record",
            "label": "Запись",
            "value": "ПЕРВИЧНАЯ РЕГИСТРАЦИЯ ТС ПРИОБРЕТЕННОГО В ТОРГОВОЙ ОРГАНИЗАЦИИ, КОТОРЫЙ ВВЕЗЕН ИЗ-ЗА РУБЕЖА",
            "is_large": true
          }
        ],
        "properties_horizontal_title": "Параметры:",
        "properties_horizontal": [
          {
            "icon": "ic_rgb",
            "label": "Цвет",
            "value": "КРАСНЫЙ"
          },
          {
            "icon": "ic_car",
            "label": "Тип",
            "value": "ЛЕГКОВОЙ"
          },
          {
            "icon": "ic_fuel",
            "label": "Топливо",
            "value": "ЭЛЕКТРО"
          },
          {
            "icon": "ic_weight",
            "label": "Масса/Макс. масса",
            "value": "2510 / 3021"
          },
          {
            "icon": "B",
            "label": "Категория/Кузов",
            "value": "УНІВЕРСАЛ-B",
            "color": "ffffff"
          },
          {
            "icon": "ic_seating",
            "label": "Сидячих мест",
            "value": "6"
          }
        ],
        "details": {
          "label": "История регистрации",
          "lock": false,
          "properties": [
            {
              "value": "2018-11-09"
            },
            {
              "label": "Гос. номер",
              "value": "AA9999TC"
            },
            {
              "label": "Запись",
              "value": "ПЕРВИЧНАЯ РЕГИСТРАЦИЯ ТС ПРИОБРЕТЕННОГО В ТОРГОВОЙ ОРГАНИЗАЦИИ, КОТОРЫЙ ВВЕЗЕН ИЗ-ЗА РУБЕЖА"
            },
            {
              "value": "2018-05-30"
            },
            {
              "label": "Запись",
              "value": "Импортировано в Украину"
            }
          ]
        },
        "photos": [],
        "whitelisted": [
          "location"
        ]
      },
      {
        "id": "wanted",
        "title": "Розыск",
        "message": "Авто с этим номером не находится в угоне",
        "message_color": "009a00",
        "info": "Выполняется проверка транспортного средства по актуальной базе розыска МВД.\n        \nОтображает краткую информацию о транспортном средстве, если он числится в розыске.\n        \nОсновной источник информации реестр МВД на data.gov.ua",
        "location": {},
        "properties": [],
        "properties_horizontal": [],
        "photos": [],
        "whitelisted": []
      },
      {
        "id": "encumbrance",
        "title": "Арест",
        "subtitle": "Актуально на: 2021-08-25 15:58:49",
        "message": "На это авто не наложен арест",
        "message_color": "009a00",
        "location": {},
        "properties": [],
        "properties_horizontal": [],
        "photos": [],
        "whitelisted": []
      },
      {
        "id": "owner",
        "title": "Владелец",
        "info": "Это вся информация которую МВД распространяет про владельца, так-как другие данные являются персональными.\n        \nОсновной источник информации реестр МВД на data.gov.ua",
        "location": {
          "address": "М.КИЇВ\nПЕЧЕРСЬКИЙ",
          "label": "Адрес",
          "icon": "ic_map",
          "zoom": 10
        },
        "properties": [
          {
            "icon": "ic_id_card",
            "value": "Физическое лицо",
            "is_large": true
          }
        ],
        "properties_horizontal": [],
        "photos": [],
        "whitelisted": []
      },
      {
        "id": "insurance",
        "is_payment_required": false,
        "title": "Страховка",
        "message": "Актуально на: 2021-08-24",
        "info": "Данные о последнем (активном или не активном) страховом полисе ОСАГО (Автогражданка) по данному номеру транспортного средства.\n        \nПолис обязателен для всех владельцев авто, зарегистрированных в Украине, но это не означает что все его покупают.\n        \nОбратите внимания, что информация может быть не актуальной, даже если страховой полис активный.\n        \nОтображаемые данные иногда могут содержать ошибки, так-как при оформлении ОСАГО вся информация заполняется вручную и могла быть заполнена не внимательно.",
        "brand": "Tesla Model X",
        "location": {},
        "properties": [
          {
            "icon": "ic_record",
            "label": "Статус",
            "value": "Действующая"
          },
          {
            "icon": "ic_license_plate",
            "label": "Гос. номер",
            "value": "AA9999TC"
          },
          {
            "icon": "ic_insurance",
            "label": "Номер полиса",
            "value": "202250172",
            "is_large": true
          },
          {
            "icon": "ic_barcode",
            "label": "VIN",
            "value": "5YJXCBE2XHF043074",
            "is_large": true,
            "whitelisted": true
          },
          {
            "icon": "ic_record",
            "label": "Страховщик",
            "value": "ПрАТ \"СК \"ВАН КЛІК\"\n(044) 377-72-06; (093) 170-55-86\ninfo@oneclick.co.ua\nм. Полтава, вул. Пушкіна, 47",
            "is_large": true
          }
        ],
        "properties_horizontal": [],
        "photos": [],
        "whitelisted": []
      },
      {
        "id": "gov_registration",
        "is_payment_required": false,
        "title": "Гос. регистрация",
        "subtitle": "США",
        "brand": "Tesla",
        "model": "Model X 100D / 75D / 90D",
        "make_year": 2017,
        "location": {},
        "properties": [
          {
            "icon": "ic_calendar",
            "label": "Последняя запись",
            "value": "2018-02-26"
          },
          {
            "icon": "ic_speedometer",
            "label": "Одометр (км)",
            "value": "5671"
          },
          {
            "icon": "ic_accident_damaged_vehicles",
            "label": "Кол-во ДТП",
            "value": "1",
            "is_large": false,
            "scale": 1.5
          },
          {
            "icon": "ic_id_card",
            "label": "Кол-во владельцев",
            "value": "1"
          },
          {
            "icon": "ic_barcode",
            "label": "VIN",
            "value": "5YJXCBE2XHF043074",
            "is_large": true,
            "whitelisted": true
          },
          {
            "icon": "ic_files",
            "label": "Полная история США",
            "value": "Отчёт <b>Autocheck</b><br><small>Подробная история автомобиля:<br>• История владельцев,<br>• Проверки одометра,<br>• Проверка повреждений<br>и многое другое</small>",
            "is_large": true,
            "lock": false,
            "action": "weblink",
            "action_value": "https://api.carplates.app/autocheck/8647f8ce16f2482cb0d10ccdf9e93538"
          }
        ],
        "properties_horizontal": [],
        "photos": [],
        "whitelisted": []
      },
      {
        "id": "was_at_auction",
        "is_payment_required": false,
        "title": "Было на аукционе",
        "subtitle": "США - Copart",
        "brand": "TESLA",
        "model": "MODEL X",
        "make_year": 2017,
        "price": {
          "value": "29000",
          "currency": "$",
          "tooltip": "Выигрышная ставка",
          "is_whitelisted": true
        },
        "location": {
          "latitude": "33.79884000",
          "longitude": "-84.62820000",
          "location": "USA - GA - ATLANTA WEST",
          "label": "Адрес",
          "icon": "ic_map",
          "zoom": 15
        },
        "properties": [
          {
            "icon": "ic_calendar",
            "label": "Дата",
            "value": "2017-11-03"
          },
          {
            "icon": "ic_warning",
            "label": "Происшествие",
            "value": "СТОЛКНОВЕНИЕ"
          },
          {
            "icon": "ic_accident_damaged_vehicles",
            "label": "Повреждение",
            "value": "ПЕРЕДНЕЙ ЧАСТИ",
            "is_large": false,
            "scale": 1.5
          },
          {
            "icon": "ic_accident_damaged_vehicles",
            "label": "Доп. повреждения",
            "value": "БОКОВАЯ СТОРОНА",
            "is_large": false,
            "scale": 1.5
          },
          {
            "icon": "ic_speedometer",
            "label": "Одометр (км)",
            "value": "5671"
          },
          {
            "icon": "$",
            "label": "Рыночная стоимость",
            "value": "100654",
            "is_large": false,
            "scale": 1.5,
            "color": "009a00"
          },
          {
            "icon": "$",
            "label": "Стоимость ремонта",
            "value": "64000",
            "is_large": false,
            "scale": 1.5,
            "color": "009a00"
          },
          {
            "icon": "ic_barcode",
            "label": "VIN",
            "value": "5YJXCBE2XHF043074",
            "is_large": true,
            "whitelisted": true
          }
        ],
        "properties_horizontal_title": "Параметры:",
        "properties_horizontal": [
          {
            "icon": "ic_rgb",
            "label": "Цвет",
            "value": "КРАСНЫЙ"
          },
          {
            "icon": "ic_fuel",
            "label": "Топливо",
            "value": "ЭЛЕКТРИЧЕСКИЙ"
          },
          {
            "icon": "ic_drive",
            "label": "Привод",
            "value": "Полный"
          },
          {
            "icon": "ic_gearshift",
            "label": "Трансмиссия",
            "value": "АВТОМАТ"
          }
        ],
        "photos": [
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/PIX96/8808840b-ba79-4bc0-9e1b-8698b685c1d3.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/PIX96/f7a53b52-c6ef-4576-a049-f85857a4c949.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/PIX96/4d082262-2cc6-44f1-82eb-c3d77c643084.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/PIX96/14764163-e00c-4e3a-a7ac-8d6b74d84176.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/PIX96/4186a48f-d7b5-4871-9685-6b4a9ff7a1b6.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/PIX96/079efacf-e0ee-446e-89d4-09ee66c43784.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/PIX96/9cd9bd03-b663-4f80-8b52-5ccc926fec22.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/PIX96/de6ea65f-178b-4c82-8401-0d052d9cf84e.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/PIX96/2a7d4a80-706b-4a5f-aa62-26ad922b7e34.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/PIX96/cf319b95-f79d-4a38-bfb7-5bd768add609.JPG"
          }
        ],
        "whitelisted": []
      },
      {
        "id": "was_at_auction",
        "is_payment_required": false,
        "title": "Было на аукционе",
        "subtitle": "США - Copart",
        "brand": "TESLA",
        "model": "MODEL X",
        "make_year": 2017,
        "price": {
          "value": "35000",
          "currency": "$",
          "tooltip": "Выигрышная ставка",
          "is_whitelisted": true
        },
        "location": {
          "latitude": "34.86759000",
          "longitude": "-82.14109000",
          "location": "USA - SC - SPARTANBURG",
          "label": "Адрес",
          "icon": "ic_map",
          "zoom": 15
        },
        "properties": [
          {
            "icon": "ic_calendar",
            "label": "Дата",
            "value": "2017-12-20"
          },
          {
            "icon": "ic_warning",
            "label": "Происшествие",
            "value": "ДИЛЕРСКИЙ СЕРВИС КОПАРТА"
          },
          {
            "icon": "ic_accident_damaged_vehicles",
            "label": "Повреждение",
            "value": "ПЕРЕДНЕЙ ЧАСТИ",
            "is_large": false,
            "scale": 1.5
          },
          {
            "icon": "$",
            "label": "Рыночная стоимость",
            "value": "100654",
            "is_large": false,
            "scale": 1.5,
            "color": "009a00"
          },
          {
            "icon": "ic_barcode",
            "label": "VIN",
            "value": "5YJXCBE2XHF043074",
            "is_large": true,
            "whitelisted": true
          }
        ],
        "properties_horizontal_title": "Параметры:",
        "properties_horizontal": [
          {
            "icon": "ic_rgb",
            "label": "Цвет",
            "value": "КРАСНЫЙ"
          },
          {
            "icon": "ic_fuel",
            "label": "Топливо",
            "value": "ЭЛЕКТРИЧЕСКИЙ"
          },
          {
            "icon": "ic_drive",
            "label": "Привод",
            "value": "Полный"
          },
          {
            "icon": "ic_gearshift",
            "label": "Трансмиссия",
            "value": "АВТОМАТ"
          }
        ],
        "photos": [
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/HPX4/a756f807-1e64-42f5-8f61-e02e79902585.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/HPX4/18ba51ce-7655-40aa-ab1a-d59a51aac3b8.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/HPX4/8ce2aecc-74aa-4f99-a805-7e4b243368d1.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/HPX4/4069d91e-7a3d-4719-89eb-c72ad056931c.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/HPX4/42c9ec67-0e42-4956-9722-e7fa629e2beb.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/HPX4/e3ea9b68-0dd7-4a09-af12-018151a4da9e.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/HPX4/34af1114-a58c-4cbe-99c6-2d43a5640019.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/HPX4/06fab8e5-3891-4046-ab4b-1f06941055a9.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/HPX4/c6eb1630-c222-4228-942b-83f29309ce95.JPG"
          },
          {
            "photo": "https://cs.copart.com/v1/AUTH_svc.pdoc00001/HPX4/7f075aab-0481-40fb-8041-2f32f36d9c3d.JPG"
          }
        ],
        "whitelisted": []
      },
      {
        "id": "was_on_sale",
        "is_payment_required": false,
        "title": "Было на продаже",
        "subtitle": "США",
        "brand": "Tesla Model X",
        "make_year": 2017,
        "location": {},
        "properties": [
          {
            "icon": "ic_calendar",
            "label": "Дата",
            "value": "2017-09-29"
          },
          {
            "icon": "ic_engine",
            "label": "Двигатель",
            "value": "ELECTRIC",
            "is_large": true
          },
          {
            "icon": "ic_barcode",
            "label": "VIN",
            "value": "5YJXCBE2XHF043074",
            "is_large": true,
            "whitelisted": true
          }
        ],
        "properties_horizontal": [],
        "photos": [
          {
            "photo": "https://img123.s3.amazonaws.com/2017/09/29/ac/4326f240d004c423_a896d3c5fe1086.jpg"
          },
          {
            "photo": "https://img123.s3.amazonaws.com/2017/09/29/ac/4326f240d004c423_dd317f280154c7.jpg"
          },
          {
            "photo": "https://img123.s3.amazonaws.com/2017/09/29/ac/4326f240d004c423_c48fe8442747c5.jpg"
          },
          {
            "photo": "https://img123.s3.amazonaws.com/2017/09/29/ac/4326f240d004c423_7f9c4c7eca3595.jpg"
          },
          {
            "photo": "https://img123.s3.amazonaws.com/2017/09/29/ac/4326f240d004c423_a0fc817f01f223.jpg"
          },
          {
            "photo": "https://img123.s3.amazonaws.com/2017/09/29/ac/4326f240d004c423_ed5df4deabca7a.jpg"
          },
          {
            "photo": "https://img123.s3.amazonaws.com/2017/09/29/ac/4326f240d004c423_c7dc91968b1350.jpg"
          },
          {
            "photo": "https://img123.s3.amazonaws.com/2017/09/29/ac/4326f240d004c423_d8b9d20a1b00c4.jpg"
          },
          {
            "photo": "https://img123.s3.amazonaws.com/2017/09/29/ac/4326f240d004c423_f9d19d9f8c5af7.jpg"
          },
          {
            "photo": "https://img123.s3.amazonaws.com/2017/09/29/ac/4326f240d004c423_d6a423cc9df129.jpg"
          }
        ],
        "whitelisted": []
      },
      {
        "id": "bill_of_lading",
        "is_payment_required": false,
        "title": "Таможенная накладная",
        "subtitle": "Украина - Импорт",
        "trim": " ",
        "price": {
          "value": "67900",
          "currency": "$",
          "is_whitelisted": true
        },
        "location": {},
        "properties": [
          {
            "icon": "ic_calendar",
            "label": "Дата",
            "value": "2018-05-30"
          },
          {
            "icon": "ic_weight",
            "label": "Масса",
            "value": "2510"
          },
          {
            "icon": "ic_earth_globe",
            "label": "Страна продавца",
            "value": "ПОЛЬЩА",
            "is_large": false
          },
          {
            "icon": "ic_barcode",
            "label": "HS код",
            "value": "8703901010<b></b><small><br/>• СРЕДСТВА НАЗЕМНОГО ТРАНСПОРТА, КРОМЕ ЖЕЛЕЗНОДОРОЖНОГО ИЛИ ТРАМВАЙНОГО ПОДВИЖНОГО СОСТАВА, И ИХ ЧАСТИ И ПРИНАДЛЕЖНОСТИ<br/>• Автомобили легковые и прочие моторные транспортные средства, предназначенные главным образом для перевозки людей (кроме моторных транспортных средств товарной позиции 8702), включая грузопассажирские автомобили-фургоны и гоночные автомобили</small>",
            "is_large": true
          },
          {
            "icon": "ic_container",
            "label": "Товар",
            "value": "Легковий автомобіль марка TESLA модель MODEL X ідентифікаційний номер номер шасі кузов <b>5YJXCBE2XHF043074</b> призначення призначений головним чином для перевезення людей тип двигуна електричний потужність 75 кВт номер двигуна не визначений загальна кількість місць включаючи місце водія 6 кількість дверей 5 тип кузова універсал колір червоний колісна формула 4х4 календарний рік виготовлення 2017 модельний рік виготовлення 2017 фірма виробник MFD BY TESLA MOTORS INC торгівельна марка TESLA країна виробництва США US бувший у використанні ",
            "is_large": true
          }
        ],
        "properties_horizontal": [],
        "photos": [],
        "whitelisted": []
      },
      {
        "id": "vin_decode",
        "title": "Расшифровка VIN",
        "brand": "TESLA",
        "make_year": 2017,
        "location": {},
        "properties": [
          {
            "icon": "ic_earth_globe",
            "label": "Изготовлено в",
            "value": "North America\nUnited States (USA)\nCalifornia\nFremont",
            "is_large": true
          },
          {
            "icon": "ic_barcode",
            "label": "VIN",
            "value": "5YJXCBE2XHF043074",
            "is_large": true,
            "whitelisted": true
          }
        ],
        "properties_horizontal": [],
        "details": {
          "label": "Подробнее",
          "properties": [
            {
              "value": "Общее"
            },
            {
              "label": "Тип транспортного средства",
              "value": "Легковой автомобиль"
            },
            {
              "label": "Производитель",
              "value": "TESLA"
            },
            {
              "label": "Модель",
              "value": "Model X"
            },
            {
              "label": "Год выпуска",
              "value": "2017"
            },
            {
              "label": "Город Производитель",
              "value": "Fremont"
            },
            {
              "label": "Штат Производитель",
              "value": "California"
            },
            {
              "label": "Страна Производитель",
              "value": "United States (USA)"
            },
            {
              "value": "Двигатель"
            },
            {
              "label": "Тип топлива - первичный",
              "value": "Электрический"
            },
            {
              "value": "Экстерьер"
            },
            {
              "label": "Кузов",
              "value": "Спортивный внедорожник (SUV) / Многоцелевой автомобиль (MPV)"
            },
            {
              "label": "Двери",
              "value": "5"
            },
            {
              "label": "Общий вес транспортного средства",
              "value": "Класс 2E: (2722 - 3175 кг)"
            },
            {
              "label": "Количество колес",
              "value": "4"
            },
            {
              "label": "Колесная база (дюймы)",
              "value": "116.7"
            },
            {
              "value": "Интерьер"
            },
            {
              "label": "Расположение руля",
              "value": "Левый руль"
            },
            {
              "label": "Количество рядов сидений",
              "value": "2"
            },
            {
              "label": "Количество сидячих мест",
              "value": "5"
            },
            {
              "value": "Механическое"
            },
            {
              "label": "Оси",
              "value": "2"
            },
            {
              "value": "Система пассивной безопасности"
            },
            {
              "label": "Тип ремней безопасности",
              "value": "Ручной"
            },
            {
              "label": "Передние подушки безопасности",
              "value": "1-й ряд (водитель и пассажир)"
            },
            {
              "label": "Подушки безопасности подколенные",
              "value": "1-й ряд (водитель и пассажир)"
            },
            {
              "label": "Расположение боковой подушки безопасности",
              "value": "1-й ряд (водитель и пассажир)"
            },
            {
              "value": "Система активной безопасности"
            },
            {
              "label": "Адаптивный круиз-контроль",
              "value": "Необязательный"
            },
            {
              "label": "Антиблокировочная тормозная система (ABS)",
              "value": "Стандарт"
            },
            {
              "label": "Немедленное торможение (CIB)",
              "value": "Стандарт"
            },
            {
              "label": "Обнаружение слепых зон (BSD)",
              "value": "Стандарт"
            },
            {
              "label": "Электронный контроль стабильности (ESC)",
              "value": "Стандарт"
            },
            {
              "label": "Антипробуксовочная система",
              "value": "Стандарт"
            },
            {
              "label": "Предупреждение о прямом столкновении (FCW)",
              "value": "Стандарт"
            },
            {
              "label": "Предупреждение о выходе из полосы движения (LDW)",
              "value": "Стандарт"
            },
            {
              "label": "Система поддержки движения по полосам(LKS)",
              "value": "Необязательный"
            },
            {
              "label": "Система задней видимости (RVS)",
              "value": "Стандарт"
            },
            {
              "label": "Помощь при парковке",
              "value": "Необязательный"
            },
            {
              "label": "Система контроля давления в шинах (TMPS)",
              "value": "Прямой"
            }
          ]
        },
        "photos": [],
        "whitelisted": []
      }
    ],
    vin: "5YJXCBE2XHF043074"
  }
];

export const posts = [
  {
    title: 'Title 1',
    description: 'Description 1',
  },
  {
    title: 'Title 2',
    description: 'Description 2',
  },
  {
    title: 'Title 3',
    description: 'Description 3',
  },
  {
    title: 'Title 4',
    description: 'Description 4',
  },
  {
    title: 'Title 5',
    description: 'Description 5',
  },
];