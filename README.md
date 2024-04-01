# PROTECT THE SUN

## Téma

Bude se jednat o 2D hru kdy hráčovi bude přidělena kosmická loď a nepřátelé na něj budou útočit. Svou loď si bude moci vylepšovat a postupovat v progresu hry. Data se budou ukládat po zakoupení určitého itemu anebo po dokončení levelu. Hlavní myšlenka hry je příchod nepřátel s cílem zabrat naší Sluneční soustavu.

Hráč se může volně pohybovat po herní ploše a nepřátelé budou přicházet z různých stran.

Ve hře bude celkem 10 levelů seřazené podle obtížnosti. Každým splněným level se otevře možnost jít do dalšího. Také zde bude potenciální nekonečný level kdy cílem bude získat co nejvíce skóre před smrtí.

## Herní měna

Ve hře bude hráč schopen získat herní měnu plněním levelů a zebíjením nepřátelských lodí. Odměna bude ohodnocena podle druhu enemy.

## Nepřátelé

Nepřátelé se budou spawnovat z různých směrů herní plochy a tím to přispěje určitou míru náhodnosti.

## Vylepšení

Hráč si bude mít v herním obchodě možnost si zakoupit tyto vylepšení:
- Rychlost střílení (reload)
- Rychlost kosmické lodě
- Druh zbraně
- Damage zbraně
- Celkové životy hráče
- Jiné perky

## Gamleplay

Ovládaní bude jednoduché
Na počítači: WSAD / šipky + myš
Na telefonu: Joystick

## Odkazy pro vývoj

Zde budou živé linky na:
- figma návrh stránek aplikace
- odkaz do repozitáře projektu, pokud pracuji v teamu a zde vývoj neprobíhá

### Z čeho čerpat

- interaktivní hra (předělávka "deskovky")
- mohlo by být použitelné jako solitaire
- nebo "AI" protihráč
- inspirovat se můžete na [zatrolených hrách](https://www.zatrolene-hry.cz/katalog-her/?fType=cat&keyword=&theme=-1&category=-1&minlength=-1&maxlength=-1&localization=6%2C+7%2C+8&min_players=1&max_players=1&age=-1)...
- karetní hry méně typické - např. [Kabo](https://www.zatrolene-hry.cz/spolecenska-hra/kabo-8341/)
- učitelem oblíbená [Cartagena](https://www.zatrolene-hry.cz/spolecenska-hra/cartagena-422/) stále čeká na remake

### Techniky

- využití localStorage / sessionStorage
- čtení dat z externího RestAPI (fetch)
- operace DnD
- využití react-routeru
- funkčnost na mobilu (výjimka je předělávka komplexních deskových her)

### Co není obsahem 

- databáze
- bez vlastních backend service
- trapné věci: *klasické karetní hry*, *člověče nezlob se*, ...
