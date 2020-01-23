[![Netlify Status](https://api.netlify.com/api/v1/badges/8f83d5fe-b6d7-48a2-8e22-176f274ba90b/deploy-status)](https://app.netlify.com/sites/controlealtdelete/deploys)

# Controle alt delete - Etnisch profileren
_hier komt een demo video_

# link to live demo
[Demo](https://controlealtdelete.netlify.com/)

# Controle alt Delete
Controle alt delete doet onderzoek naar etnisch profilering. 
Ze hebben als partij aan de inwoners van Amsterdam gevraagd of ze een formulier willen invullen. 
De data van de formulier hebben ze verzameld en in een excel bestand opgeslagen. 
Het is aan ons als team om de data te analyzeren en te presenteren zodat de groep van Controle alt delete kan bepalen of er spraken is van etnisch profering of niet.

# Concept
We kijken naar het het percentage respodenten welk cijfer ze de politie geven in vertrouwen op basis van een westers en niet westerse migratie achtergrond. Dit kan je vergelijken met de stelling "Ik heb thuis genoeg geld om van te leven".

Ook kijken we of de respodenten vonden dat de politie beleefd was op bais van opleidings niveau.

# Hoe download je dit project.
Clone het project
`git clone https://github.com/Ramon96/controlealtdelete.git`

Navigeer met je terminal naar het mapje van het project.
Installeer vervolgends de node modules doormiddle van
`npm install`

Als de installatie klaar is kan je het project opstarten met de development command
`npm run dev`

Je kunt het project terug zien op
`localhost:1234`

# Data
Om de data te kunnen gebruiken heb ik de excel bestand in een online converter gestopt (Excel > Json)
Op advies van Joan. Om de data in te laden heb ik gebruik gemaakt van require.js
Vervolgends heb ik de data opgeschoond.

```javascript 
function cleanChartData(data){
    return data.filter(d => {
        return  d.rapportcijfer != "99999" 
    }).filter(d => {
        return d.Herkomst_def != '8'
    }).map(d => {
        return {
             Respodent: d.response_ID,
             Herkomst: ancestry(d.Herkomst_def),
             Vetrouwen: d.rapportcijfer,
             Rondkomen: d.stel_rondkomen
        }
    })
}
```
Met de fucntie hierboven haal ik de vuile data eruit en halen de we respodenten eruit die niet hun herkomst hebben opgegeven.

```javascript
function ancestry(origin){
    if(origin == "1" || origin == "6"){
        return "westers"
    }
    else{
        return "niet-westers"
    }
}
```
Met de functie hierboven zet ik de westerse bevolking en de nederlands onder de categorie westers, en alle niet westerse bevolking in de categorie niet-westers.

Vevolgends nest ik de data op basis van migratie achtergrond met de volgende functie
```javascript
    function restructureData(data){
        const sortOrigin = d3.nest()
            .key(d => d.Herkomst)
            .entries(data)
            
        const trustByOriginWestern = d3.nest()
            .key(d => d.Vetrouwen)
            .entries(sortOrigin[0].values);
            
        const trustByOriginNonWestern = d3.nest()
            .key(d => d.Vetrouwen)
            .entries(sortOrigin[1].values);
            
        const objectsW = trustByOriginWestern.map(obj => {
            return {
                herkomst: 'Westers',
                percentage: Math.ceil((100 / sortOrigin[0].values.length) * obj.values.length),
                groeplengte: obj.values.length,
                vertrouwen: obj.key
            }
        })
        
        const objectsN = trustByOriginNonWestern.map(obj => {
            return {     
                herkomst: 'niet-westers',
                percentage: Math.ceil((100 / sortOrigin[1].values.length) * obj.values.length),
                groeplengte: obj.values.length,
                vertrouwen: obj.key
            }
        })
        
        const newData = [...objectsW, ...objectsN];

        update(newData);
        // return newData;
    }
```
Ik maak een groep met westerse en een groep met niet westerse en die geef ik het vetrouwen mee en ik reken hoe groot de percentage is van de groep. 

omdat het vetrouwens cijfer 1 - 10 is krijg ik 20 resultaten terug (10 westerse en 10 niet westerse)
Dit kan ik vervolgends in mijn kaart plotten.

# Proces & Design Rationale
Ons proces en De design rationalen zijn online terug te vinden.
[Proces en design rationale](https://jennifer98-s.gitbook.io/cntrl-alt-delete/)

# Gebruikte tools
* parcel.js
* d3.js
* d3-tip
* require.js
* Data van Controle alt delete

# Bronnen
Voorbeeld van mike bostock is als inspiratie bron gebruikt bij het maken van de eerste chart. 
Het is niet overgenomen maar er zijn wel elementen nagemaakt. 
https://observablehq.com/@d3/grouped-bar-chart

Dit is gebruikt bij het maken van de 2de chart. 
https://bl.ocks.org/63anp3ca/6bafeb64181d87750dbdba78f8678715

# Credits
Ik wil graag [Nick](https://github.com/CountNick) bedanken, hij heeft me op de goede weg geholpen. Hij heeft ook veel van zijn vrije tijd opgeofferd om mij te helpen met debuggen om me d3 wat beter te helpen te begrijpen.
 
Ook wil ik graag [Tomas](https://github.com/TomasS666) bedanken. Zonder hem zou het niet gelukt zijn. Tomas heeft me ontzettend veel bijgeleerd op het gebied van nesten in d3 en vergelijkingen binnen d3 tegenelkaar op kan zetten. Hij heeft me geholpen waar ik niet uit kon komen en heeft een ook flink wat tijd van z'n dag in me gestoken.

# Team
Jennifer Slagt ,Sajjad Ali en Ramon Meijers

# License
[MIT @ Ramon Meijers](https://github.com/Ramon96/frontend-data/blob/master/LICENSE)

