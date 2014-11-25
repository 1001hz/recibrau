app.value('unitSystemConfig', {
    contents: {
        Metric: {
            weightLarge: "Kg",
            weightSmall: "g",
            volume: "Litre",
            temperature: "C"
        },
        US: {
            weightLarge: "Lbs",
            weightSmall: "oz",
            volume: "Gal (US)",
            temperature: "F"
        }
    }
})
.value('brewMethodConfig', [
        "All grain",
        "BIAB",
        "Partial mash",
        "Extract"
]
)
.value('beerStylesConfig', [
        "Ale",
        "Bock",
        "Dopple",
        "Lager"
]
)
.value('mashRestConfig', [
    {
        name: "Beta-Glucanase",
        metric: {
            low: 40,
            high: 45
        },
        us: {
            low: 104,
            hugh: 113
        }
    },{
        name: "Protease",
        metric: {
            low: 50,
            high: 54
        },
        us: {
            low: 122,
            hugh: 129.2
        }
    }
]);