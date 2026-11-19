window.PERSONNES = [
    { id: "danielle", name: "Danielle", image: "img/danielle.jpeg", initials: "D", stage: "daloa", period: "CM2", text: "Une des deux sœurs rencontrées en CM2, parmi mes premières belles amitiés d'école." },
    { id: "eslie", name: "Eslie", image: "img/eslie.jpeg", initials: "E", stage: "daloa", period: "CM2", text: "L'autre sœur, rencontrée elle aussi en CM2." },
    { id: "cedric-junior", name: "Gnamien N'Goran Cédric Junior", image: "img/cedric.jpeg", initials: "CJ", stage: "soubre", period: "5ème", text: "Ancien du lycée scientifique, aujourd'hui en 2ème année d'ingénieur statisticien. Un ami devenu un frère : mêmes ambitions, même esprit, même vocation." },
    { id: "boka-grace", name: "Boka Grâce", image: "img/bokagrace.jpeg", initials: "BG", stage: "soubre", period: "4ème", text: "Une amie partie trop tôt cette année. Son souvenir reste vivant en moi." },
    { id: "anabelle", name: "Anabelle", image: "img/anabelle.jpeg", initials: "A", stage: "soubre", period: "3ème", text: "Devenue une sœur pour moi." },
    { id: "aziz", name: "Diarra Abdoul Aziz", image: null, initials: "AZ", stage: "soubre", period: "3ème", text: "Un ami précieux." },
    { id: "hugor", name: "Atta Yao Beni Hugor", image: null, initials: "H", stage: "soubre", period: "3ème", text: "Un ami devenu un frère." },
    { id: "sephora", name: "Séphora", image: null, initials: "S", stage: "soubre", period: "1ère D", text: "Une amie engagée dans la foi chrétienne." },
    { id: "arrielle", name: "Arrielle", image: "img/arrielle.jpeg", initials: "A", stage: "soubre", period: "Terminale", text: "Une véritable pépite." },
    { id: "sarah-valencia", name: "Konan Sarah Valencia", image: "img/sarah.jpeg", initials: "SV", stage: "ailleurs", period: "Été 2025", text: "Rencontrée après les compositions du BAC : ma meilleure rencontre de l'année, une grâce dans ma vie.", beacon: { x: 17, y: 14, side: "right" } },
    { id: "freres-bernabe", name: "Les frères Bernabé", image: null, initials: "FB", stage: "ailleurs", period: "2025", text: "Mes frères musiciens, un groupe de musiciens de grande qualité.", beacon: { x: 78, y: 27, side: "left" }, group: true },
    { id: "kader", name: "Kader KEBE (Kvdev)", honorName: "KEBE KADER", alias: "Kvdev", image: "img/kader.jpeg", initials: "K", stage: "ailleurs", period: "Novembre 2025", text: "Mon mentor, à la fois source de motivation et formateur.", texteLong: "Depuis notre rencontre en novembre 2025, KEBE Kader (Kvdev) occupe une place particulière dans mon parcours. Il est un mentor et une véritable source de motivation, ainsi qu'un formateur de grande qualité. Il m'a transmis des connaissances, des conseils et une vision. Il est une source d'inspiration dans mon évolution personnelle et professionnelle, et il m'a encouragé à croire davantage en mon potentiel et en mes ambitions.", beacon: { x: 22, y: 40, side: "right" } },
    { id: "alma", name: "Les ALMA", image: "img/alma.jpeg", initials: "AL", stage: "ailleurs", period: "Février 2026", text: "Un groupe de filles remarquables.", beacon: { x: 76, y: 53, side: "left" }, group: true },
    { id: "arthur", name: "Arthur", image: "img/artur.jpeg", initials: "AR", stage: "ailleurs", period: "2026", text: "Que j'appelle mon jumeau, un développeur redoutable.", beacon: { x: 20, y: 66, side: "right" } },
    { id: "emmanuelle-deborah", name: "Emmanuelle Déborah", image: "img/deborah.jpeg", initials: "ED", stage: "ailleurs", period: "2026", text: "Ma plus belle rencontre de l'année.", beacon: { x: 74, y: 79, side: "left" } },
    { id: "amani", name: "Amani Kouadio Christ-Manassé", image: "img/manasse.jpeg", initials: "AM", stage: "voyageur", period: "", text: "", role: "portrait-voyageur" }
];

window.RENCONTRES = {
  introduction: "On ne devient pas ce qu'on est tout seul. À chaque étape de mon parcours, la vie a mis sur ma route des personnes qui ont laissé une trace durable en moi.",
  conclusion: "Et tant d'autres : on ne peut pas tout dire, mais chacun a sa place dans mon histoire.",
  personnes: window.PERSONNES.filter((personne) => personne.stage !== "voyageur")
};
