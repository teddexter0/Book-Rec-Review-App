import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// This uses the free Open Library API which doesn't require an API key
const OPEN_LIBRARY_API = "https://openlibrary.org";

// Predefined book recommendations by genre
// This is our "fake AI" approach - predefined quality recommendations
const bookRecommendations = {
  Romance: [
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "9780141439518",
      rating: 9.2,
      short_summary:
        "The spirited Elizabeth Bennet faces mounting pressure from her status-conscious mother to secure a suitable marriage. But when Elizabeth meets the handsome but enigmatic Mr. Darcy, pride and prejudice complicate their relationship.",
    },
    {
      title: "Jane Eyre",
      author: "Charlotte Brontë",
      isbn: "9780141441146",
      rating: 8.9,
      short_summary:
        "The story of a passionate young woman who defies Victorian convention by escaping a harsh upbringing to become a governess. When she falls in love with her enigmatic employer, Mr. Rochester, she discovers a secret that could destroy their relationship.",
    },
    {
      title: "Call Me by Your Name",
      author: "André Aciman",
      isbn: "9781250169440",
      rating: 8.7,
      short_summary:
        "During a sun-drenched summer on the Italian Riviera, 17-year-old Elio falls in love with his father's research assistant, Oliver. Their passionate affair transforms both their lives and lingers in their memories long after it ends.",
    },
    {
      title: "Red, White & Royal Blue",
      author: "Casey McQuiston",
      isbn: "9781250316776",
      rating: 8.5,
      short_summary:
        "When America's First Son falls in love with the Prince of Wales after an incident creates a media scandal, their secret relationship could derail his mother's reelection campaign and upend international relations.",
    },
    {
      title: "Wuthering Heights",
      author: "Emily Brontë",
      isbn: "9780141439556",
      rating: 8.8,
      short_summary:
        "The turbulent and passionate story of Heathcliff and Catherine Earnshaw, whose love transcends social class and death itself. Their obsessive love eventually destroys them and many around them.",
    },
    {
      title: "The Bride Test",
      author: "Helen Hoang",
      isbn: "9780451490827",
      rating: 8.3,
      short_summary:
        "Khai Diep avoids relationships due to his autism making him believe he has no feelings. His mother returns to Vietnam to find him a bride and brings back Esme Tran, a mixed-race girl with dreams of finding her American father.",
    },
    {
      title: "The Song of Achilles",
      author: "Madeline Miller",
      isbn: "9780062060624",
      rating: 9.0,
      short_summary:
        "A retelling of Homer's Iliad told from the perspective of Patroclus, who is exiled to the court of King Peleus where he meets the king's perfect son, Achilles. The two form an inseparable bond that follows them into the Trojan War.",
    },
    {
      title: "Normal People",
      author: "Sally Rooney",
      isbn: "9781984822185",
      rating: 8.6,
      short_summary:
        "The story of Connell and Marianne who grow up in the same small town in Ireland. They pretend not to know each other in school, where Connell is popular and Marianne is a loner, but a connection that has grown between them lasts long into adulthood.",
    },
    {
      title: "Beach Read",
      author: "Emily Henry",
      isbn: "9781984806734",
      rating: 8.4,
      short_summary:
        "A romance writer who no longer believes in love and a literary writer stuck in a rut engage in a summer-long challenge to get them out of their creative blocks, with unexpected results.",
    },
    {
      title: "It Ends with Us",
      author: "Colleen Hoover",
      isbn: "9781501110368",
      rating: 8.7,
      short_summary:
        "Lily hasn't always had it easy, but she's worked hard to create the life she wants. When she meets neurosurgeon Ryle Kincaid, she falls for him despite his aversion to relationships. But when Atlas Corrigan suddenly reappears, her relationship with Ryle is threatened.",
    },
    {
      title: "Persuasion",
      author: "Jane Austen",
      isbn: "9780141439686",
      rating: 8.8,
      short_summary:
        "Anne Elliot was persuaded to break off her engagement to Frederick Wentworth eight years ago. When he returns from the Napoleonic Wars as a wealthy naval captain, the two are thrown together again, and old feelings resurface.",
    },
    {
      title: "Bridgerton: The Duke and I",
      author: "Julia Quinn",
      isbn: "9780062353597",
      rating: 8.2,
      short_summary:
        "In Regency London, Daphne Bridgerton and the Duke of Hastings form a fake courtship to keep marriage-minded mothers at bay for him and attract suitors for her. Their plan works too well as they find themselves falling for each other.",
    },
    {
      title: "Eleanor & Park",
      author: "Rainbow Rowell",
      isbn: "9781250012579",
      rating: 8.4,
      short_summary:
        "Set over the course of one school year in 1986, this is the story of two misfits who meet on the school bus and develop an unlikely relationship, first through comics and mix tapes, and then something deeper.",
    },
    {
      title: "The Light We Lost",
      author: "Jill Santopolo",
      isbn: "9780735212756",
      rating: 8.3,
      short_summary:
        "Lucy and Gabe meet on September 11, 2001, and decide that day to live life differently. Over thirteen years, they separate and come together, experiencing life's joys and sorrows, and must ultimately make a choice between love and destiny.",
    },
    {
      title: "The Wedding Date",
      author: "Jasmine Guillory",
      isbn: "9780399587665",
      rating: 8.0,
      short_summary:
        "When Alexa agrees to attend a wedding as Drew's fake girlfriend after they get stuck in an elevator together, they're surprised by their strong chemistry and genuine connection. But with their different cities and lives, can they make it work?",
    },
    {
      title: "A Court of Thorns and Roses",
      author: "Sarah J. Maas",
      isbn: "9781619634442",
      rating: 8.5,
      short_summary:
        "When huntress Feyre kills a wolf in the woods, a beast-like creature arrives to demand retribution. Dragged to a magical realm she only knows about from legends, Feyre discovers her captor is one of the lethal, immortal faeries who once ruled her world.",
    },

    {
      title: "Outlander",
      author: "Diana Gabaldon",
      isbn: "9780440212560",
      rating: 8.7,
      short_summary:
        "When Claire Randall walks through a standing stone circle in Scotland, she's suddenly transported back to 1743, where she meets the dashing Highland warrior Jamie Fraser and becomes torn between two vastly different men in two irreconcilable lives.",
    },
    {
      title: "The Notebook",
      author: "Nicholas Sparks",
      isbn: "9780553816716",
      rating: 8.1,
      short_summary:
        "The tale of Noah Calhoun and Allie Nelson, whose love-story is documented in a notebook that Noah reads to Allie, now suffering from Alzheimer's, every day to help her remember their life together.",
    },
    {
      title: "The Hating Game",
      author: "Sally Thorne",
      isbn: "9780062439598",
      rating: 8.5,
      short_summary:
        "Lucy Hutton and Joshua Templeman hate each other. Executive assistants to co-CEOs of a publishing company, they're engaged in a series of passive-aggressive mind games. But the tension between them explodes when both compete for the same promotion.",
    },
    {
      title: "Me Before You",
      author: "Jojo Moyes",
      isbn: "9780143124542",
      rating: 8.3,
      short_summary:
        "When Louisa Clark loses her job at a café, she takes a position as a caretaker for Will Traynor, a wealthy banker left paralyzed from an accident. What starts as a professional relationship develops into something more as they change each other's lives.",
    },
    {
      title: "The Time Traveler's Wife",
      author: "Audrey Niffenegger",
      isbn: "9780099464464",
      rating: 8.6,
      short_summary:
        "The love story of Henry, a librarian who involuntarily time travels, and Clare, an artist whose life takes a natural sequential course. Their passionate affair endures across a sea of time and captures the two lovers in an impossibly romantic trap.",
    },
    {
      title: "The Fault in Our Stars",
      author: "John Green",
      isbn: "9780142424179",
      rating: 8.4,
      short_summary:
        "Hazel Grace Lancaster, a 16-year-old cancer patient, meets Augustus Waters at a cancer support group. Their ensuing love story is as real as it is tragic, exploring the funny, thrilling, and tragic business of being alive and in love.",
    },
  ],
  Mystery: [
    {
      title: "Gone Girl",
      author: "Gillian Flynn",
      isbn: "9780307588371",
      rating: 8.8,
      short_summary:
        "On their fifth wedding anniversary, Nick Dunne reports that his wife, Amy, has gone missing. Under pressure from the police and a growing media frenzy, Nick's portrait of a blissful marriage begins to crumble.",
    },
    {
      title: "In the Woods",
      author: "Tana French",
      isbn: "9780143113492",
      rating: 8.5,
      short_summary:
        "Detective Rob Ryan and his partner Cassie investigate the murder of a 12-year-old girl in a Dublin suburb. Twenty years earlier, Ryan was found in the same woods, traumatized and unable to recall what happened to his missing friends.",
    },
    {
      title: "The No. 1 Ladies' Detective Agency",
      author: "Alexander McCall Smith",
      isbn: "9781400034772",
      rating: 8.3,
      short_summary:
        "In Botswana, Precious Ramotswe starts the country's first female-owned detective agency. With intuition and wisdom, she helps people solve the mysteries in their lives, from missing husbands to con men.",
    },
    {
      title: "Murder on the Orient Express",
      author: "Agatha Christie",
      isbn: "9780062073501",
      rating: 8.9,
      short_summary:
        "Famous detective Hercule Poirot investigates the murder of a wealthy American aboard the Orient Express, stranded by a snowstorm with thirteen suspicious passengers who all had connections to the victim.",
    },
    {
      title: "The Cuckoo's Calling",
      author: "Robert Galbraith",
      isbn: "9780316206853",
      rating: 8.2,
      short_summary:
        "Private detective Cormoran Strike investigates a supermodel's suicide. As he delves into the world of the rich and famous, he uncovers a complex conspiracy behind her death. The first in J.K. Rowling's detective series written under a pseudonym.",
    },
    {
      title: "In Cold Blood",
      author: "Truman Capote",
      isbn: "9780679745587",
      rating: 8.8,
      short_summary:
        "A pioneering example of true crime, this non-fiction novel details the 1959 murders of a Kansas farming family and the investigation that led to the capture, trial, and execution of the killers.",
    },
    {
      title: "Rebecca",
      author: "Daphne du Maurier",
      isbn: "9780380730407",
      rating: 8.7,
      short_summary:
        "A young woman marries wealthy widower Maxim de Winter and moves to his estate, Manderley, where she finds herself living in the shadow of his first wife, Rebecca, whose legacy is kept alive by the sinister housekeeper Mrs. Danvers.",
    },
    {
      title: "The Secret History",
      author: "Donna Tartt",
      isbn: "9781400031702",
      rating: 8.9,
      short_summary:
        "A group of classics students at an elite New England college descend into a world of twisted morality and corruption. When one of them is murdered, the others must deal with the consequences of their actions.",
    },
    {
      title: "The Thursday Murder Club",
      author: "Richard Osman",
      isbn: "9780241425442",
      rating: 8.5,
      short_summary:
        "Four friends in a retirement village meet weekly to solve cold cases for fun. When a real murder occurs on their doorstep, they find themselves in the middle of their first live investigation.",
    },
    {
      title: "Sharp Objects",
      author: "Gillian Flynn",
      isbn: "9780307341556",
      rating: 8.4,
      short_summary:
        "Reporter Camille Preaker returns to her hometown to cover the murders of two preteen girls. Trying to unravel the psychological puzzle of her own past, she finds herself identifying with the young victims a bit too strongly.",
    },
    {
      title: "The Woman in Cabin 10",
      author: "Ruth Ware",
      isbn: "9781501132957",
      rating: 8.2,
      short_summary:
        "Travel journalist Lo Blacklock is given the assignment of a lifetime: a week on a luxury cruise. But during the journey, she witnesses a woman being thrown overboard—a woman who supposedly never existed.",
    },
    {
      title: "Big Little Lies",
      author: "Liane Moriarty",
      isbn: "9780425274866",
      rating: 8.5,
      short_summary:
        "A murder occurs at an elementary school trivia night, but neither the victim nor the killer is immediately revealed. The story explores the events leading up to the crime through the perspectives of three mothers whose children attend the school.",
    },
    {
      title: "The Guest List",
      author: "Lucy Foley",
      isbn: "9780062868930",
      rating: 8.0,
      short_summary:
        "On a remote island off the coast of Ireland, guests gather for the wedding of a magazine publisher and a reality TV star. As a storm approaches, secrets emerge and someone ends up dead.",
    },
    {
      title: "The Girl on the Train",
      author: "Paula Hawkins",
      isbn: "9781594634024",
      rating: 8.3,
      short_summary:
        "Rachel takes the same commuter train every day and watches a seemingly perfect couple through the window. One day, she witnesses something shocking and becomes entangled in the investigation that follows.",
    },
    {
      title: "The 7½ Deaths of Evelyn Hardcastle",
      author: "Stuart Turton",
      isbn: "9781492657965",
      rating: 8.6,
      short_summary:
        "At a gala at Blackheath House, Evelyn Hardcastle will die—again. She's been murdered hundreds of times, and Aiden Bishop must solve her murder by inhabiting the bodies of eight different witnesses. Each day, Aiden wakes in a new host.",
    },
    {
      title: "Knives Out",
      author: "Linda Castillo",
      isbn: "9781250142863",
      rating: 8.4,
      short_summary:
        "When renowned crime novelist Harlan Thrombey is found dead at his estate, the inquisitive Detective Benoit Blanc is mysteriously enlisted to investigate. He must sift through a web of lies to uncover the truth.",
    },
    {
      title: "The Girl with the Dragon Tattoo",
      author: "Stieg Larsson",
      isbn: "9780307949486",
      rating: 8.5,
      short_summary:
        "Journalist Mikael Blomkvist and hacker Lisbeth Salander investigate the disappearance of a young woman from a wealthy family and uncover a web of family secrets and intrigue.",
    },
    {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      isbn: "9781250301697",
      rating: 8.7,
      short_summary:
        "Alicia Berenson, a famous painter, shoots her husband and then never speaks again. Psychotherapist Theo Faber is determined to get her to talk and unravel the mystery of why she shot her husband.",
    },
    {
      title: "And Then There Were None",
      author: "Agatha Christie",
      isbn: "9780062073488",
      rating: 9.0,
      short_summary:
        "Ten strangers are invited to an isolated island by a mysterious host, and start to get killed one by one. Could one of them be the killer?",
    },
    {
      title: "The Da Vinci Code",
      author: "Dan Brown",
      isbn: "9780307474278",
      rating: 8.3,
      short_summary:
        "Harvard symbologist Robert Langdon must work with cryptologist Sophie Neveu to solve a murder in Paris's Louvre Museum and discover the ultimate secret protected by a clandestine society since the days of Christ.",
    },
    {
      title: "The Woman in the Window",
      author: "A.J. Finn",
      isbn: "9780062678423",
      rating: 8.1,
      short_summary:
        "Anna Fox lives alone, a recluse in her New York City home, drinking too much wine and spying on her neighbors. Then she sees something she shouldn't, and her already fragile world begins to crumble.",
    },
    {
      title: "In the Woods",
      author: "Tana French",
      isbn: "9780143113492",
      rating: 8.2,
      short_summary:
        "Detective Rob Ryan and his partner investigate the murder of a 12-year-old girl in a Dublin suburb. The case bears a striking resemblance to a case from Ryan's own past, when his two friends disappeared in the same woods.",
    },
  ],
  "Science Fiction": [
    {
      title: "Dune",
      author: "Frank Herbert",
      isbn: "9780441172719",
      rating: 9.2,
      short_summary:
        "Set in the distant future, Dune tells the story of Paul Atreides, whose family accepts stewardship of the planet Arrakis, the only source of the coveted spice melange, the most valuable substance in the universe.",
    },
    {
      title: "Ready Player One",
      author: "Ernest Cline",
      isbn: "9780307887443",
      rating: 8.8,
      short_summary:
        "In a dystopian 2045, people escape reality in the virtual reality world OASIS. When its creator dies, he leaves his fortune to the first person who can find an Easter egg hidden within, triggering a contest that grips the world.",
    },
    {
      title: "The Left Hand of Darkness",
      author: "Ursula K. Le Guin",
      isbn: "9780441478125",
      rating: 8.7,
      short_summary:
        "An envoy from Earth attempts to bring the planet Gethen into an interstellar alliance, but must first understand its ambisexual inhabitants who can change their gender, and navigate its complex politics and harsh winter environment.",
    },
    {
      title: "Hyperion",
      author: "Dan Simmons",
      isbn: "9780553283686",
      rating: 8.9,
      short_summary:
        "On the eve of Armageddon, with the entire galaxy at war, seven pilgrims set out on a final journey to the time tombs on Hyperion, where the Shrike, a creature that kills with infinite pain, awaits. Each carries a desperate hope and a terrible secret.",
    },
    {
      title: "Children of Time",
      author: "Adrian Tchaikovsky",
      isbn: "9781447273301",
      rating: 8.8,
      short_summary:
        "The last remnants of humanity leave Earth for a terraformed planet, only to find it harbors an evolutionary experiment gone wrong: a species of intelligent spiders is now the dominant life form.",
    },
    {
      title: "Station Eleven",
      author: "Emily St. John Mandel",
      isbn: "9780804172448",
      rating: 8.6,
      short_summary:
        "Set in the Great Lakes region after a fictional swine flu pandemic has devastated the world, the novel follows a traveling Shakespeare company that performs for the remaining settlements.",
    },
    {
      title: "The Long Way to a Small, Angry Planet",
      author: "Becky Chambers",
      isbn: "9781473619814",
      rating: 8.5,
      short_summary:
        "Rosemary joins the diverse crew of the Wayfarer, a wormhole-building spaceship, as they embark on a mission to build a hyperspace tunnel to a distant planet, facing dangers and forming deep bonds along the way.",
    },
    {
      title: "Red Rising",
      author: "Pierce Brown",
      isbn: "9780345539809",
      rating: 8.7,
      short_summary:
        "In a color-coded society on Mars, lower-caste 'Red' miner Darrow infiltrates the ruling 'Gold' caste to bring down their cruel system from within after his wife is executed for singing a forbidden song.",
    },
    {
      title: "The Forever War",
      author: "Joe Haldeman",
      isbn: "9780312536633",
      rating: 8.5,
      short_summary:
        "Private William Mandella fights in an interstellar war against the Taurans. Due to time dilation, each tour of duty means centuries pass on Earth, making him increasingly alienated from the civilization he's supposedly defending.",
    },
    {
      title: "Ancillary Justice",
      author: "Ann Leckie",
      isbn: "9780316246620",
      rating: 8.4,
      short_summary:
        "Once a starship AI controlling thousands of corpse soldiers, Breq is now confined to a single human body. She pursues a quest for revenge against the Lord of the Radch empire who betrayed her and destroyed her ship.",
    },
    {
      title: "Old Man's War",
      author: "John Scalzi",
      isbn: "9780765348272",
      rating: 8.5,
      short_summary:
        "75-year-old John Perry joins the Colonial Defense Forces, which transfers his consciousness to a genetically enhanced young body, then sends him to fight in humanity's wars for colonies among the stars.",
    },
    {
      title: "The Road",
      author: "Cormac McCarthy",
      isbn: "9780307387899",
      rating: 8.8,
      short_summary:
        "A father and his son walk alone through a post-apocalyptic America, struggling to survive and preserve their humanity in a world where most have turned to barbarism and cannibalism.",
    },
    {
      title: "The Expanse: Leviathan Wakes",
      author: "James S.A. Corey",
      isbn: "9780316129084",
      rating: 8.6,
      short_summary:
        "Humanity has colonized the solar system, but tensions rise between Earth, Mars, and the Belt. When a ship's ice miner discovers a derelict vessel, he finds himself in possession of a secret that could trigger interplanetary war.",
    },
    {
      title: "Contact",
      author: "Carl Sagan",
      isbn: "9781501197987",
      rating: 8.7,
      short_summary:
        "Astronomer Ellie Arroway discovers a radio signal from an extraterrestrial civilization, leading to humanity's first encounter with intelligent alien life and transforming her scientific worldview and spiritual understanding.",
    },
    {
      title: "Recursion",
      author: "Blake Crouch",
      isbn: "9781524759780",
      rating: 8.6,
      short_summary:
        "Detective Barry Sutton investigates False Memory Syndrome, a mysterious condition where people suddenly remember alternate lives. Neuroscientist Helena Smith has invented a technology to preserve memories, but it's being used to rewrite reality itself.",
    },
    {
      title: "The Calculating Stars",
      author: "Mary Robinette Kowal",
      isbn: "9780765378385",
      rating: 8.5,
      short_summary:
        "In an alternate 1952, a meteorite destroys Washington D.C. and accelerates the need for space colonization. Mathematician and WASP pilot Elma York fights to become the world's first female astronaut despite institutional sexism.",
    },
    {
      title: "Neuromancer",
      author: "William Gibson",
      isbn: "9780441569595",
      rating: 8.7,
      short_summary:
        "Case was the sharpest data-thief in the Matrix, until he crossed the wrong people and they damaged his nervous system. Now a mysterious new employer has recruited him for a last-chance run at an unthinkably powerful artificial intelligence.",
    },
    {
      title: "The Martian",
      author: "Andy Weir",
      isbn: "9780553418026",
      rating: 9.0,
      short_summary:
        "After a dust storm forces his crew to evacuate Mars, astronaut Mark Watney is presumed dead and left behind. With only a few supplies, he must draw upon his ingenuity and wit to survive on the hostile planet.",
    },
    {
      title: "Foundation",
      author: "Isaac Asimov",
      isbn: "9780553293357",
      rating: 8.8,
      short_summary:
        "Psychohistorian Hari Seldon creates a foundation of encyclopedists at the edge of the galaxy to preserve knowledge in preparation for the coming Dark Ages after the fall of the Galactic Empire.",
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      isbn: "9780593135204",
      rating: 9.1,
      short_summary:
        "Ryland Grace wakes up with no memory aboard a spacecraft. As his memory returns, he realizes he's humanity's only hope to solve an extinction-level threat from an alien microorganism consuming the sun's energy.",
    },
    {
      title: "The Three-Body Problem",
      author: "Cixin Liu",
      isbn: "9780765382030",
      rating: 8.8,
      short_summary:
        "Set against the backdrop of China's Cultural Revolution, this story begins with a secret military project that sends signals into space to establish contact with aliens, leading to Earth's first alien contact.",
    },
    {
      title: "Snow Crash",
      author: "Neal Stephenson",
      isbn: "9780553380958",
      rating: 8.6,
      short_summary:
        "In a future America, Hiro Protagonist, a hacker and pizza delivery driver, investigates a powerful computer virus that's affecting people in the Metaverse virtual reality.",
    },
  ],
  Fantasy: [
    {
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
      isbn: "9780756404741",
      rating: 9.3,
      short_summary:
        "Kvothe, an infamous magician, adventurer, and musician, tells the story of his path from childhood in a troupe of traveling players to a homeless orphan to his years at a university of magic.",
    },
    {
      title: "Circe",
      author: "Madeline Miller",
      isbn: "9780316556347",
      rating: 9.0,
      short_summary:
        "The daughter of the titan Helios, Circe discovers her power of witchcraft and is banished to a deserted island. There, she hones her skills and crosses paths with famous mythological figures, ultimately finding her own power and voice.",
    },
    {
      title: "Six of Crows",
      author: "Leigh Bardugo",
      isbn: "9781627792127",
      rating: 8.9,
      short_summary:
        "Criminal prodigy Kaz Brekker is offered a chance at a deadly heist that could make him rich beyond his wildest dreams. To pull it off, he assembles a crew of six dangerous outcasts, each with a unique skill and their own agenda.",
    },
    {
      title: "American Gods",
      author: "Neil Gaiman",
      isbn: "9780380789030",
      rating: 8.8,
      short_summary:
        "Recently released from prison, Shadow Moon meets the mysterious Mr. Wednesday, who hires him as a bodyguard. Shadow soon becomes embroiled in a conflict between the Old Gods of mythology and the New Gods of technology and media.",
    },
    {
      title: "The Priory of the Orange Tree",
      author: "Samantha Shannon",
      isbn: "9781635570298",
      rating: 8.6,
      short_summary:
        "In this epic fantasy, the divided East and West maintain an uneasy peace as the rising threat of dragons looms. Three women—a queen, a dragonrider, and a lady-in-waiting—hold the power to either save the world or condemn it.",
    },
    {
      title: "The Night Circus",
      author: "Erin Morgenstern",
      isbn: "9780307744432",
      rating: 8.7,
      short_summary:
        "The circus arrives without warning. Two young magicians, Celia and Marco, are pitted against each other in a mysterious competition within the magical night circus, only to fall in love with disastrous consequences.",
    },
    {
      title: "Uprooted",
      author: "Naomi Novik",
      isbn: "9780804179058",
      rating: 8.8,
      short_summary:
        "Agnieszka loves her valley home and her quiet village, but the corrupted Wood stands on the border, filled with malevolent power. Her people rely on the cold, ambitious wizard known as the Dragon to keep the Wood's dark influence at bay.",
    },
    {
      title: "The City & The City",
      author: "China Miéville",
      isbn: "9780345497529",
      rating: 8.4,
      short_summary:
        "Inspector Tyador Borlú of the Extreme Crime Squad investigates the murder of a woman found in the city of Besźel. The case leads him to Ul Qoma, a city that occupies the same physical space as Besźel but exists in a parallel reality.",
    },
    {
      title: "The Magicians",
      author: "Lev Grossman",
      isbn: "9780452296299",
      rating: 8.3,
      short_summary:
        "Quentin Coldwater is a high school senior secretly obsessed with a series of fantasy novels. When he's admitted to a secretive college for magic in upstate New York, he discovers that the magical world from his childhood books is real and far darker than he imagined.",
    },
    {
      title: "The Poppy War",
      author: "R.F. Kuang",
      isbn: "9780062662569",
      rating: 8.7,
      short_summary:
        "When Rin aces the Keju—the Empire-wide test to find talented youth—she surprises everyone by gaining admission to Sinegard, the most elite military school. There, she discovers her shamanic powers and the terrible cost of war.",
    },
    {
      title: "The First Law Trilogy: The Blade Itself",
      author: "Joe Abercrombie",
      isbn: "9781591025948",
      rating: 8.5,
      short_summary:
        "In this gritty fantasy, Inquisitor Glokta, a crippled ex-war hero turned torturer; Logen Ninefingers, a notorious barbarian trying to make peace; and Jezal dan Luthar, a vain nobleman, are drawn into the machinations of Bayaz, the First of the Magi.",
    },
    {
      title: "Stardust",
      author: "Neil Gaiman",
      isbn: "9780061689246",
      rating: 8.4,
      short_summary:
        "To win the heart of his beloved, Tristran Thorn journeys to the realm of Faerie to retrieve a fallen star. What he finds instead is a spirited young woman who becomes the target of ruthless hunters and supernatural creatures.",
    },
    {
      title: "The Once and Future King",
      author: "T.H. White",
      isbn: "9780441627400",
      rating: 8.9,
      short_summary:
        "This beloved retelling of the Arthurian legend follows young Arthur from his early training under the wizard Merlyn through his rise to become King of England, the founding of the Round Table, and its eventual dissolution.",
    },
    {
      title: "The Lies of Locke Lamora",
      author: "Scott Lynch",
      isbn: "9780553588941",
      rating: 8.8,
      short_summary:
        "Locke Lamora is an orphan turned thief who leads the Gentleman Bastards, an elite group of con artists operating in the island city of Camorr. Their elaborate schemes target the wealthy nobility until a mysterious figure threatens their existence.",
    },
    {
      title: "Children of Blood and Bone",
      author: "Tomi Adeyemi",
      isbn: "9781250170972",
      rating: 8.5,
      short_summary:
        "In a West African-inspired fantasy world where magic has been outlawed, Zélie Adebola has one chance to restore magic to her people and strike against the monarchy that killed her mother and subjugated her kind.",
    },
    {
      title: "The Bear and the Nightingale",
      author: "Katherine Arden",
      isbn: "9781101885956",
      rating: 8.6,
      short_summary:
        "At the edge of the Russian wilderness, winter lasts most of the year and the snowdrifts grow taller than houses. Vasilisa defies tradition to protect her family and village from dark forces that emerge from the forest.",
    },

    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      isbn: "9780345534835",
      rating: 9.4,
      short_summary:
        "Bilbo Baggins is swept into an epic quest to reclaim the lost Dwarf Kingdom of Erebor from the fearsome dragon Smaug, forcing the homebody hobbit to leave his comfortable home.",
    },
    {
      title: "Mistborn: The Final Empire",
      author: "Brandon Sanderson",
      isbn: "9780765350381",
      rating: 9.0,
      short_summary:
        "In a world where ash falls from the sky and mists dominate the night, an evil force known as the Lord Ruler reigns with ultimate power. A half-Skaa orphan discovers she possesses the powers of a Mistborn and becomes the unlikely heroine of a brewing rebellion.",
    },
    {
      title: "A Game of Thrones",
      author: "George R.R. Martin",
      isbn: "9780553593716",
      rating: 9.1,
      short_summary:
        "In the land of Westeros, nine noble families fight for control of the Seven Kingdoms. Meanwhile, dark forces stir beyond the protective Wall in the frozen North, and an ancient enemy threatens to return.",
    },
    {
      title: "The Lion, the Witch and the Wardrobe",
      author: "C.S. Lewis",
      isbn: "9780064471046",
      rating: 8.9,
      short_summary:
        "Four siblings discover a magical wardrobe that leads to the land of Narnia, where they must help the lion Aslan save Narnia from the evil White Witch.",
    },
    {
      title: "The Fifth Season",
      author: "N.K. Jemisin",
      isbn: "9780316229296",
      rating: 9.0,
      short_summary:
        "In a world plagued by catastrophic geological activity, certain people have the ability to control the earth's movements. When Essun's husband murders their son and kidnaps their daughter, she sets off on a mission of revenge in a world coming apart at the seams.",
    },
    {
      title: "Jonathan Strange & Mr Norrell",
      author: "Susanna Clarke",
      isbn: "9780765356154",
      rating: 8.7,
      short_summary:
        "In early 19th-century England, two very different magicians emerge to change the course of history. Mr. Norrell is practical and cautious; Jonathan Strange is charismatic and reckless. Together, they achieve great things in the service of England.",
    },
  ],
  Thriller: [
    {
      title: "The Girl on the Train",
      author: "Paula Hawkins",
      isbn: "9781594634024",
      rating: 8.3,
      short_summary:
        "Rachel Watson takes the same commuter train every day, which passes by her old house where her ex-husband lives with his new wife. One day, she sees something shocking, and becomes entangled in a missing persons investigation.",
    },
    {
      title: "You",
      author: "Caroline Kepnes",
      isbn: "9781476785608",
      rating: 8.3,
      short_summary:
        "Bookstore manager Joe Goldberg becomes obsessed with aspiring writer Guinevere Beck. His infatuation quickly spirals into a toxic pursuit as he uses technology and social media to stalk her and remove obstacles to their relationship.",
    },
    {
      title: "Dark Places",
      author: "Gillian Flynn",
      isbn: "9780307341570",
      rating: 8.2,
      short_summary:
        "Libby Day was seven when her mother and sisters were murdered. Her testimony put her brother in prison for life. Twenty-five years later, a group of amateur investigators believes he's innocent, forcing Libby to revisit the traumatic events of that night.",
    },
    {
      title: "Misery",
      author: "Stephen King",
      isbn: "9781501156748",
      rating: 8.7,
      short_summary:
        "After a car accident, famous novelist Paul Sheldon is rescued by his 'number one fan,' Annie Wilkes. As she nurses him back to health, her devotion turns to obsession, especially when she discovers he's killed off her favorite character.",
    },
    {
      title: "The Girl with All the Gifts",
      author: "M.R. Carey",
      isbn: "9780356500157",
      rating: 8.4,
      short_summary:
        "In a dystopian future, most of humanity has been infected by a fungus that turns people into 'hungries.' A group of children who are infected but retain their mental abilities may hold the key to humanity's future.",
    },
    {
      title: "Defending Jacob",
      author: "William Landay",
      isbn: "9780345533661",
      rating: 8.4,
      short_summary:
        "When his 14-year-old son is accused of murdering a classmate, assistant district attorney Andy Barber finds his world torn apart as he tries to prove his son's innocence while grappling with the possibility that the boy inherited a 'murder gene'.",
    },
    {
      title: "No Exit",
      author: "Taylor Adams",
      isbn: "9780062875655",
      rating: 8.2,
      short_summary:
        "During a blizzard, college student Darby Thorne is stranded at a highway rest stop with four strangers. When she discovers a kidnapped child in one of their vehicles, she must figure out which person is the kidnapper and how to save the child.",
    },
    {
      title: "The Good Daughter",
      author: "Karin Slaughter",
      isbn: "9780062430243",
      rating: 8.5,
      short_summary:
        "Twenty-eight years ago, Charlotte and Samantha Quinn's happy small-town life was torn apart by a terrifying attack that left their mother dead. Now, another violent attack in their hometown brings the sisters together to uncover the truth about the crimes.",
    },
    {
      title: "The Kind Worth Killing",
      author: "Peter Swanson",
      isbn: "9780062267535",
      rating: 8.6,
      short_summary:
        "On a night flight, Ted Severson meets Lily Kintner and reveals that he suspects his wife is having an affair. In a game of truth, Ted jokes that he could kill his wife, and Lily offers to help, setting in motion a twisted tale of psychological manipulation.",
    },
    {
      title: "Behind Closed Doors",
      author: "B.A. Paris",
      isbn: "9781250121004",
      rating: 8.1,
      short_summary:
        "Everyone knows a couple like Jack and Grace: he has looks and wealth, she has charm and elegance. But behind the perfect façade, Grace is a prisoner in her own home, controlled by her perfect husband.",
    },
    {
      title: "The Silent Wife",
      author: "A.S.A. Harrison",
      isbn: "9780143123231",
      rating: 8.0,
      short_summary:
        "Jodi and Todd appear to be a perfect couple, but their carefully constructed façade is crumbling. As domestic tensions rise, an unexpected turn of events leads to a shocking finale.",
    },
    {
      title: "Into the Water",
      author: "Paula Hawkins",
      isbn: "9780735211209",
      rating: 7.9,
      short_summary:
        "In a town where a river runs through it, women have been drowning for centuries. When Nel Abbott is found dead in the river, her estranged sister Jules returns to care for Nel's teenage daughter and confront the town's dark history.",
    },
    {
      title: "The Whisper Man",
      author: "Alex North",
      isbn: "9781250317995",
      rating: 8.3,
      short_summary:
        "After the death of his wife, Tom Kennedy moves with his son to a new town for a fresh start. But the town has a dark past: twenty years ago, a serial killer called 'The Whisper Man' abducted and murdered five young boys. Now, history seems to be repeating itself.",
    },
    {
      title: "Lock Every Door",
      author: "Riley Sager",
      isbn: "9781524745158",
      rating: 8.2,
      short_summary:
        "Jules Larsen takes a job as an apartment sitter in the Bartholomew, one of Manhattan's most high-profile buildings. But the Bartholomew has a dark history, and as fellow apartment sitters disappear, Jules investigates the building's sinister past.",
    },
    {
      title: "The Woman in White",
      author: "Wilkie Collins",
      isbn: "9780141439617",
      rating: 8.5,
      short_summary:
        "A young art teacher encounters a mysterious woman dressed in white on a moonlit London road. Later, he travels to his new position at Limmeridge House and finds that the woman in white has a strange connection to his pupils.",
    },
    {
      title: "And Then There Were None",
      author: "Agatha Christie",
      isbn: "9780062073488",
      rating: 8.9,
      short_summary:
        "Ten strangers are lured to an isolated island mansion by a mysterious host. When they start dying one by one, they realize a killer is among them, inspired by the old nursery rhyme 'Ten Little Indians.'",
    },

    {
      title: "The Silence of the Lambs",
      author: "Thomas Harris",
      isbn: "9780312924584",
      rating: 9.0,
      short_summary:
        "FBI trainee Clarice Starling is assigned to interview the brilliant psychiatrist and cannibalistic serial killer Dr. Hannibal Lecter to gain insight into another killer, 'Buffalo Bill,' who skins his female victims.",
    },
    {
      title: "Gone",
      author: "Michael Grant",
      isbn: "9780061448782",
      rating: 8.5,
      short_summary:
        "In the small town of Perdido Beach, everyone over the age of 15 suddenly vanishes, and the town is encased in an impenetrable dome. The remaining children must establish order and survive as some develop strange powers.",
    },
    {
      title: "The Shining",
      author: "Stephen King",
      isbn: "9780307743657",
      rating: 8.9,
      short_summary:
        "Jack Torrance takes a job as the winter caretaker at the isolated Overlook Hotel, with his wife and son. As winter sets in, the hotel's dark secrets emerge, and Jack's sanity deteriorates.",
    },
    {
      title: "Before I Go to Sleep",
      author: "S.J. Watson",
      isbn: "9780062060556",
      rating: 8.1,
      short_summary:
        "Christine wakes up every day with no memory of her past. Through a journal she keeps, she begins to piece together her past and discovers disturbing truths about her life and the people around her.",
    },
    {
      title: "Sharp Objects",
      author: "Gillian Flynn",
      isbn: "9780307341556",
      rating: 8.4,
      short_summary:
        "Reporter Camille Preaker returns to her hometown to investigate the murders of two young girls. As she reconnects with her estranged family, she confronts her own psychological demons.",
    },
    {
      title: "Bird Box",
      author: "Josh Malerman",
      isbn: "9780062259660",
      rating: 8.2,
      short_summary:
        "In a world where seeing something mysterious drives people to deadly violence, Malorie navigates a post-apocalyptic landscape blindfolded, trying to protect herself and her children from entities that must not be seen.",
    },
  ],
  "Non-Fiction": [
    {
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      isbn: "9780062316097",
      rating: 9.2,
      short_summary:
        "A groundbreaking narrative of humanity's creation and evolution that explores how biology and history have defined us and enhanced our understanding of what it means to be 'human.'",
    },
    {
      title: "Born to Run",
      author: "Christopher McDougall",
      isbn: "9780307279187",
      rating: 8.7,
      short_summary:
        "The author explores the world of the Tarahumara Indians of Mexico's Copper Canyons, legendary for their superhuman running abilities, to discover the secrets of running without pain or injury.",
    },
    {
      title: "The Devil in the White City",
      author: "Erik Larson",
      isbn: "9780375725609",
      rating: 8.6,
      short_summary:
        "A gripping account intertwining the stories of two men: Daniel H. Burnham, the architect behind the 1893 Chicago World's Fair, and H.H. Holmes, a serial killer who used the fair to lure victims to his 'Murder Castle.'",
    },
    {
      title: "Guns, Germs, and Steel",
      author: "Jared Diamond",
      isbn: "9780393354324",
      rating: 8.8,
      short_summary:
        "This Pulitzer Prize-winning book explores why some human societies became dominant while others did not, attributing success not to racial differences but to geographic, environmental, and ecological factors.",
    },
    {
      title: "Bad Blood",
      author: "John Carreyrou",
      isbn: "9780525431992",
      rating: 8.9,
      short_summary:
        "The riveting story of Elizabeth Holmes and Theranos, the multibillion-dollar biotech startup that made Holmes the world's youngest female self-made billionaire before it all came crashing down amid accusations of massive fraud.",
    },
    {
      title: "The Immortal Life of Henrietta Lacks",
      author: "Rebecca Skloot",
      isbn: "9781400052189",
      rating: 8.7,
      short_summary:
        "The story of Henrietta Lacks, whose cells—taken without her knowledge in 1951—became one of the most important tools in medicine, vital for developing the polio vaccine, cloning, gene mapping, and more.",
    },
    {
      title: "Quiet: The Power of Introverts",
      author: "Susan Cain",
      isbn: "9780307352156",
      rating: 8.5,
      short_summary:
        "Susan Cain argues that modern Western culture misunderstands and undervalues the traits and capabilities of introverted people, leading to a waste of talent, energy, and happiness.",
    },
    {
      title: "The New Jim Crow",
      author: "Michelle Alexander",
      isbn: "9781595586438",
      rating: 8.9,
      short_summary:
        "An examination of how the U.S. criminal justice system functions as a contemporary system of racial control by targeting black men through the War on Drugs and decimating communities of color.",
    },
    {
      title: "Educated",
      author: "Tara Westover",
      isbn: "9780399590504",
      rating: 9.0,
      short_summary:
        "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    },
    {
      title: "The Immortal Life of Henrietta Lacks",
      author: "Rebecca Skloot",
      isbn: "9781400052189",
      rating: 8.7,
      short_summary:
        "The story of Henrietta Lacks, a poor tobacco farmer whose cells—taken without her knowledge in 1951—became one of the most important tools in medicine, vital for developing the polio vaccine, cloning, gene mapping, and more.",
    },
    {
      title: "Becoming",
      author: "Michelle Obama",
      isbn: "9781524763138",
      rating: 8.9,
      short_summary:
        "The former First Lady of the United States offers a memoir where she chronicles the experiences that have shaped her—from her childhood on the South Side of Chicago to her years balancing motherhood and work to her time at the White House.",
    },
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      isbn: "9780553380163",
      rating: 8.8,
      short_summary:
        "In this landmark book, Stephen Hawking explains the universe, from the Big Bang to black holes, in a way that is accessible to the general reader, with wit and clarity.",
    },
    {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      isbn: "9780374533557",
      rating: 9.1,
      short_summary:
        "Renowned psychologist Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think—System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical.",
    },
    {
      title: "In Cold Blood",
      author: "Truman Capote",
      isbn: "9780679745587",
      rating: 8.6,
      short_summary:
        "The true account of the 1959 murder of four members of the Clutter family in Kansas, and the subsequent capture, trial, and execution of their killers. It pioneered the 'non-fiction novel' genre.",
    },
  ],
  "Self-Help": [
    {
      title: "Can't Hurt Me",
      author: "David Goggins",
      isbn: "9781544512280",
      rating: 9.4,
      short_summary:
        "David Goggins shares his life story and how he transformed himself through self-discipline, mental toughness, and hard work.",
    },
    {
      title: "The 48 Laws of Power",
      author: "Robert Greene",
      isbn: "9780140280197",
      rating: 9.2,
      short_summary:
        "A guide to understanding and mastering the dynamics of power through historical examples and strategies.",
    },
    {
      title: "The Four Agreements",
      author: "Don Miguel Ruiz",
      isbn: "9781878424310",
      rating: 9.0,
      short_summary:
        "Offers a code of conduct based on ancient Toltec wisdom to achieve personal freedom and true happiness.",
    },
    {
      title: "How to Win Friends and Influence People",
      author: "Dale Carnegie",
      isbn: "9780671027032",
      rating: 9.1,
      short_summary:
        "Timeless principles for effective communication and relationship-building to achieve personal and professional success.",
    },
    {
      title: "Rich Dad Poor Dad",
      author: "Robert T. Kiyosaki",
      isbn: "9781612680194",
      rating: 8.9,
      short_summary:
        "Contrasts the financial philosophies of the author's two 'dads' to teach the importance of financial literacy and independence.",
    },
    {
      title: "The Power of Habit",
      author: "Charles Duhigg",
      isbn: "9780812981605",
      rating: 9.0,
      short_summary:
        "Explores the science of habit formation and how habits can be changed to improve our lives.",
    },
    {
      title: "Deep Work",
      author: "Cal Newport",
      isbn: "9781455586691",
      rating: 9.1,
      short_summary:
        "Emphasizes the importance of focused work in a distracted world and provides strategies to cultivate deep concentration.",
    },
    {
      title: "Grit",
      author: "Angela Duckworth",
      isbn: "9781501111112",
      rating: 8.8,
      short_summary:
        "Investigates the power of passion and perseverance in achieving long-term goals.",
    },
    {
      title: "The Magic of Thinking Big",
      author: "David J. Schwartz",
      isbn: "9780671646783",
      rating: 8.7,
      short_summary:
        "Encourages readers to set high goals and think positively to achieve success.",
    },
    {
      title: "The Miracle Morning",
      author: "Hal Elrod",
      isbn: "9780979019715",
      rating: 8.6,
      short_summary:
        "Introduces a morning routine designed to transform your life by focusing on personal development activities.",
    },
    {
      title: "The War of Art",
      author: "Steven Pressfield",
      isbn: "9781936891023",
      rating: 8.9,
      short_summary:
        "Addresses the challenges of creative work and offers strategies to overcome resistance and achieve artistic success.",
    },
    {
      title: "Think and Grow Rich",
      author: "Napoleon Hill",
      isbn: "9781585424337",
      rating: 9.0,
      short_summary:
        "A classic guide to achieving personal and financial success through positive thinking and goal setting.",
    },
    {
      title: "The Power of Positive Thinking",
      author: "Norman Vincent Peale",
      isbn: "9780743234801",
      rating: 8.7,
      short_summary:
        "Promotes the benefits of optimism and faith in achieving a fulfilling life.",
    },
    {
      title: "Drive: The Surprising Truth About What Motivates Us",
      author: "Daniel H. Pink",
      isbn: "9781594484803",
      rating: 8.8,
      short_summary:
        "Explores the psychology of motivation and how autonomy, mastery, and purpose drive human behavior.",
    },
    {
      title: "Awaken the Giant Within",
      author: "Tony Robbins",
      isbn: "9780671791544",
      rating: 8.9,
      short_summary:
        "Provides strategies for taking control of your emotions, finances, relationships, and life.",
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      isbn: "9780735211292",
      rating: 9.3,
      short_summary:
        "An easy and proven way to build good habits and break bad ones, focusing on small behavior changes that lead to remarkable results over time.",
    },
    {
      title: "The 7 Habits of Highly Effective People",
      author: "Stephen R. Covey",
      isbn: "9781982137274",
      rating: 9.0,
      short_summary:
        "Presents an approach to being effective in attaining goals by aligning oneself to what Covey calls 'true north' principles based on a character ethic that he believes to be universal and timeless.",
    },
    {
      title: "You Are a Badass",
      author: "Jen Sincero",
      isbn: "9780762447695",
      rating: 8.5,
      short_summary:
        "Serving a refreshing blend of motivational guidance, personal stories, and authentic advice, this book helps readers understand and get past their self-sabotaging beliefs and behaviors.",
    },
    {
      title: "The Power of Now",
      author: "Eckhart Tolle",
      isbn: "9781577314806",
      rating: 8.9,
      short_summary:
        "A guide to spiritual enlightenment that emphasizes the importance of living in the present moment and transcending thoughts of the past or future.",
    },
    {
      title: "Mindset: The New Psychology of Success",
      author: "Carol S. Dweck",
      isbn: "9780345472328",
      rating: 8.7,
      short_summary:
        "After decades of research, world-renowned Stanford University psychologist Carol S. Dweck discovered a simple but groundbreaking idea: the power of mindset.",
    },
    {
      title: "The Subtle Art of Not Giving a F*ck",
      author: "Mark Manson",
      isbn: "9780062457714",
      rating: 8.6,
      short_summary:
        "A counterintuitive approach to living a good life, where the author argues that improving our lives hinges not on our ability to turn lemons into lemonade, but on learning to stomach lemons better.",
    },
    {
      title: "Daring Greatly",
      author: "Brené Brown",
      isbn: "9781592407330",
      rating: 8.8,
      short_summary:
        "How the courage to be vulnerable transforms the way we live, love, parent, and lead. Challenges everything we think we know about vulnerability.",
    },
  ],
  Horror: [
    {
      title: "The Shining",
      author: "Stephen King",
      isbn: "9780307743657",
      rating: 9.2,
      short_summary:
        "A family heads to an isolated hotel for the winter where an evil presence influences the father into violence.",
    },
    {
      title: "Bird Box",
      author: "Josh Malerman",
      isbn: "9780062259653",
      rating: 8.7,
      short_summary:
        "In a post-apocalyptic world, a mother and her two children must make it through a forest and river blindfolded to avoid supernatural entities.",
    },
    {
      title: "The Silence of the Lambs",
      author: "Thomas Harris",
      isbn: "9780312924584",
      rating: 9.0,
      short_summary:
        "A young FBI trainee seeks the help of imprisoned cannibalistic killer Dr. Hannibal Lecter to catch another serial killer.",
    },
    {
      title: "The Only Good Indians",
      author: "Stephen Graham Jones",
      isbn: "9781982136451",
      rating: 8.8,
      short_summary:
        "Four American Indian men are haunted by a disturbing event from their youth, leading to a relentless, supernatural revenge.",
    },
    {
      title: "The Troop",
      author: "Nick Cutter",
      isbn: "9781476717722",
      rating: 8.6,
      short_summary:
        "A group of boys on a scouting trip encounter a bioengineered horror in the wilderness.",
    },
    {
      title: "The Fisherman",
      author: "John Langan",
      isbn: "9781945373156",
      rating: 8.9,
      short_summary:
        "Two widowers discover a mysterious fishing spot with a dark history and supernatural elements.",
    },
    {
      title: "Mexican Gothic",
      author: "Silvia Moreno-Garcia",
      isbn: "9780525620785",
      rating: 8.8,
      short_summary:
        "A glamorous socialite is called to a haunted house in 1950s Mexico and uncovers terrifying family secrets.",
    },
    {
      title: "Pet Sematary",
      author: "Stephen King",
      isbn: "9781501156700",
      rating: 9.0,
      short_summary:
        "A family's move to a new home near a pet cemetery leads to sinister events after they discover what lies beyond it.",
    },
    {
      title: "The Haunting of Hill House",
      author: "Shirley Jackson",
      isbn: "9780143039983",
      rating: 9.1,
      short_summary:
        "A psychological horror classic about a group of people exploring a supposedly haunted mansion.",
    },
    {
      title: "The Cabin at the End of the World",
      author: "Paul Tremblay",
      isbn: "9780062679109",
      rating: 8.7,
      short_summary:
        "A vacationing family is taken hostage by strangers who claim the world is ending and they must make a sacrifice.",
    },
    {
      title: "The Ritual",
      author: "Adam Nevill",
      isbn: "9780316176538",
      rating: 8.8,
      short_summary:
        "A group of old college friends get lost in a Scandinavian forest and discover ancient horrors stalking them.",
    },
    {
      title: "Something Wicked This Way Comes",
      author: "Ray Bradbury",
      isbn: "9780062072061",
      rating: 8.6,
      short_summary:
        "Two boys face a mysterious and evil carnival that arrives in their town, offering dark temptations.",
    },
    {
      title: "Dracula",
      author: "Bram Stoker",
      isbn: "9780141439846",
      rating: 9.3,
      short_summary:
        "The original vampire horror novel that introduced Count Dracula and shaped the gothic horror genre.",
    },
    {
      title: "House of Leaves",
      author: "Mark Z. Danielewski",
      isbn: "9780375703768",
      rating: 8.9,
      short_summary:
        "A haunting story within a story about a house that is bigger on the inside than it is on the outside.",
    },
    {
      title: "The Exorcist",
      author: "William Peter Blatty",
      isbn: "9780061007224",
      rating: 9.0,
      short_summary:
        "Based on a true story, this novel follows a young girl possessed by a demon and the priests who attempt an exorcism.",
    },
    {
      title: "It",
      author: "Stephen King",
      isbn: "9781501142970",
      rating: 9.1,
      short_summary:
        "Seven adults who were once terrorized by an evil entity that preyed on the children of Derry, Maine, return to their hometown to confront the nightmare creature that haunted their childhood.",
    },
    {
      title: "House of Leaves",
      author: "Mark Z. Danielewski",
      isbn: "9780375703768",
      rating: 8.7,
      short_summary:
        "A family moves into a small home on Ash Tree Lane where they discover something terribly wrong: their house is bigger on the inside than it is on the outside.",
    },
    {
      title: "The Haunting of Hill House",
      author: "Shirley Jackson",
      isbn: "9780143039983",
      rating: 8.8,
      short_summary:
        "Four seekers arrive at a notoriously unfriendly pile called Hill House. At first, their stay seems destined to be merely a chilling encounter with inexplicable phenomena, but Hill House is gathering its powers and will choose one of them to make its own.",
    },
    {
      title: "Dracula",
      author: "Bram Stoker",
      isbn: "9780199564095",
      rating: 8.9,
      short_summary:
        "The classic tale of Count Dracula's bloodthirsty quest to spread the curse of the undead across England, opposed by Professor Van Helsing and a small band of brave individuals.",
    },
    {
      title: "Pet Sematary",
      author: "Stephen King",
      isbn: "9781501156700",
      rating: 8.6,
      short_summary:
        "When Dr. Louis Creed takes a new job in rural Maine, he discovers a mysterious burial ground hidden deep in the woods near his new home. As tragedy strikes his family, the cemetery beckons with the power to resurrect the dead, but at a terrible cost.",
    },
    {
      title: "The Exorcist",
      author: "William Peter Blatty",
      isbn: "9780061007224",
      rating: 8.5,
      short_summary:
        "When a 12-year-old girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her daughter. The novel inspired one of the most shocking films in cinematic history.",
    },
    {
      title: "Mexican Gothic",
      author: "Silvia Moreno-Garcia",
      isbn: "9780525620808",
      rating: 8.3,
      short_summary:
        "After receiving a frantic letter from her newlywed cousin, Noemí Taboada heads to High Place, a distant house in the Mexican countryside, where she discovers dark secrets and the terrifying nature of her cousin's new husband's family.",
    },
  ],
  Biography: [
    {
      title: "Long Walk to Freedom",
      author: "Nelson Mandela",
      isbn: "9780316548182",
      rating: 9.4,
      short_summary:
        "Mandela’s journey from rural village to prisoner to president of South Africa—a story of resilience and reconciliation.",
    },
    {
      title: "The Diary of a Young Girl",
      author: "Anne Frank",
      isbn: "9780553296983",
      rating: 9.2,
      short_summary:
        "The wartime diary of a Jewish girl hiding from the Nazis—filled with hope, fear, and humanity.",
    },
    {
      title: "Steve Jobs",
      author: "Walter Isaacson",
      isbn: "9781451648539",
      rating: 9.0,
      short_summary:
        "A compelling portrait of the visionary Apple co-founder, drawn from exclusive interviews and insights.",
    },
    {
      title: "Becoming",
      author: "Michelle Obama",
      isbn: "9781524763138",
      rating: 8.8,
      short_summary:
        "The former First Lady’s deeply personal story of growth, purpose, and breaking barriers.",
    },
    {
      title: "Educated",
      author: "Tara Westover",
      isbn: "9780399590504",
      rating: 9.1,
      short_summary:
        "Raised by survivalist parents, Tara escapes her isolated upbringing through education—against all odds.",
    },
    {
      title: "When Breath Becomes Air",
      author: "Paul Kalanithi",
      isbn: "9780812988406",
      rating: 9.2,
      short_summary:
        "A young neurosurgeon faces terminal cancer and reflects on life, faith, and meaning.",
    },
    {
      title: "Born a Crime",
      author: "Trevor Noah",
      isbn: "9780399588174",
      rating: 9.0,
      short_summary:
        "Comedian Trevor Noah’s funny and moving tale of growing up biracial in apartheid South Africa.",
    },
    {
      title: "I Am Malala",
      author: "Malala Yousafzai",
      isbn: "9780316322423",
      rating: 8.9,
      short_summary:
        "A courageous girl stands up for education and survives a Taliban attack—her voice now inspires the world.",
    },
    {
      title: "Just Mercy",
      author: "Bryan Stevenson",
      isbn: "9780812984965",
      rating: 9.0,
      short_summary:
        "A lawyer’s powerful fight for justice and redemption in America’s broken legal system.",
    },
    {
      title: "Man’s Search for Meaning",
      author: "Viktor E. Frankl",
      isbn: "9780807014295",
      rating: 9.3,
      short_summary:
        "A Holocaust survivor and psychiatrist explores suffering, purpose, and human resilience.",
    },
    {
      title: "The Diary of a Young Girl",
      author: "Anne Frank",
      isbn: "9780553577129",
      rating: 9.3,
      short_summary:
        "The journal of a young Jewish girl who hid from the Nazis for two years before being discovered. Her remarkable diary has since become a world classic—a powerful reminder of the horrors of war and an eloquent testament to the human spirit.",
    },
    {
      title: "Steve Jobs",
      author: "Walter Isaacson",
      isbn: "9781451648539",
      rating: 9.0,
      short_summary:
        "The definitive biography of Apple co-founder Steve Jobs, based on more than forty interviews with Jobs conducted over two years—as well as interviews with more than a hundred family members, friends, adversaries, competitors, and colleagues.",
    },
    {
      title: "I Know Why the Caged Bird Sings",
      author: "Maya Angelou",
      isbn: "9780345514400",
      rating: 9.1,
      short_summary:
        "Maya Angelou's debut memoir chronicles her childhood and early adult experiences. The first in a seven-volume series, it is a story of overcoming prejudice and trauma through strength, determination, and an unwavering love of literature.",
    },
    {
      title: "Born a Crime",
      author: "Trevor Noah",
      isbn: "9780399588198",
      rating: 8.9,
      short_summary:
        "Trevor Noah's unlikely path from apartheid South Africa to the desk of The Daily Show began with a criminal act: his birth. Born to a white Swiss father and a black Xhosa mother, Noah was born a crime, a living proof of his parents' indiscretion.",
    },
    {
      title: "Unbroken",
      author: "Laura Hillenbrand",
      isbn: "9780812974492",
      rating: 8.8,
      short_summary:
        "A World War II story of survival, resilience, and redemption of former Olympic track star and bombardier Louis Zamperini, who survived a plane crash in the Pacific, forty-seven days adrift in a raft, and two years in Japanese prisoner-of-war camps.",
    },
    {
      title: "Alexander Hamilton",
      author: "Ron Chernow",
      isbn: "9780143034759",
      rating: 8.7,
      short_summary:
        "The inspiration for the hit Broadway musical, this biography of Founding Father Alexander Hamilton traces his rise from a bastard orphan to Washington's right-hand man, and his death in a duel with Aaron Burr.",
    },
    {
      title: "Into the Wild",
      author: "Jon Krakauer",
      isbn: "9780385486804",
      rating: 8.5,
      short_summary:
        "The true story of Christopher McCandless, a young man who abandoned his possessions, gave his savings to charity, and walked alone into the Alaskan wilderness in search of a raw, transcendent experience.",
    },
  ],
  Christian: [
    {
      title: "The Pursuit of God",
      author: "A.W. Tozer",
      isbn: "9781600660542",
      rating: 9.5,
      short_summary:
        "A passionate call to deeper intimacy with Christ—written in 1948, but timelessly relevant.",
    },
    {
      title: "Knowing God",
      author: "J.I. Packer",
      isbn: "9780830816507",
      rating: 9.3,
      short_summary:
        "Deep theology made warm and personal—helping believers truly ‘know’ and walk with God.",
    },
    {
      title: "Mere Christianity",
      author: "C.S. Lewis",
      isbn: "9780060652920",
      rating: 9.4,
      short_summary:
        "A brilliant, logical defense of Christianity and what it means to live it out.",
    },
    {
      title: "Crazy Love",
      author: "Francis Chan",
      isbn: "9781434768513",
      rating: 8.8,
      short_summary:
        "A fiery call to radical, all-in love for God that shakes up casual Christianity.",
    },
    {
      title: "Don't Waste Your Life",
      author: "John Piper",
      isbn: "9781581344983",
      rating: 9.1,
      short_summary:
        "Live with eternity in mind—your life is short, so live it sold out for Christ.",
    },
    {
      title: "The Normal Christian Life",
      author: "Watchman Nee",
      isbn: "9780842347105",
      rating: 9.2,
      short_summary:
        "A powerful unpacking of Romans—dying with Christ, rising with Him, and walking in grace daily.",
    },
    {
      title: "God's Smuggler",
      author: "Brother Andrew",
      isbn: "9780800793011",
      rating: 9.0,
      short_summary:
        "The true story of a daring missionary who smuggled Bibles into Communist countries with prayer and faith.",
    },
    {
      title: "Tortured for Christ",
      author: "Richard Wurmbrand",
      isbn: "9780882640011",
      rating: 9.4,
      short_summary:
        "A Romanian pastor endures years of torture for preaching Jesus—his faith and love remain unbroken.",
    },
    {
      title: "The Hiding Place",
      author: "Corrie ten Boom",
      isbn: "9780553256697",
      rating: 9.3,
      short_summary:
        "A Christian family hides Jews during WWII—and faces the darkness of prison with unshakable faith.",
    },
    {
      title: "Radical",
      author: "David Platt",
      isbn: "9781601422217",
      rating: 8.9,
      short_summary:
        "A bold challenge to reject the American dream and embrace the costly call of Christ.",
    },
    {
      title: "Mere Christianity",
      author: "C.S. Lewis",
      isbn: "9780060652920",
      rating: 9.2,
      short_summary:
        "A theological book adapted from a series of BBC radio talks made by C.S. Lewis, offering a rational case for the Christian faith during a skeptical, post-war era.",
    },
    {
      title: "The Purpose Driven Life",
      author: "Rick Warren",
      isbn: "9780310205715",
      rating: 8.9,
      short_summary:
        "A 40-day spiritual journey that helps readers discover their purpose, answering the question, 'What on earth am I here for?' by exploring God's five purposes for their lives.",
    },
    {
      title: "The Case for Christ",
      author: "Lee Strobel",
      isbn: "9780310339304",
      rating: 8.7,
      short_summary:
        "A former atheist journalist's investigation of the evidence for Jesus, interviewing experts on the historical, scientific, and psychiatric evidence for the resurrection and other claims of Christianity.",
    },
    {
      title: "Crazy Love",
      author: "Francis Chan",
      isbn: "9781434768513",
      rating: 8.8,
      short_summary:
        "Francis Chan challenges readers to take the Bible seriously and encounter God's passionate, unconditional love in ways that will transform how they live.",
    },
    {
      title: "The Screwtape Letters",
      author: "C.S. Lewis",
      isbn: "9780060652937",
      rating: 9.0,
      short_summary:
        "A classic masterpiece of religious satire that entertains readers with its sly and ironic portrayal of human life and foibles from the vantage point of Screwtape, a highly placed assistant to the Chief Tempter.",
    },
    {
      title: "Redeeming Love",
      author: "Francine Rivers",
      isbn: "9781590525135",
      rating: 8.6,
      short_summary:
        "A powerful retelling of the story of Gomer and Hosea, set during the California Gold Rush. Angel, a woman sold into prostitution as a child, meets a man who makes her face the painful truth about her past and offers her a way out.",
    },
    {
      title: "The Chronicles of Narnia",
      author: "C.S. Lewis",
      isbn: "9780066238500",
      rating: 9.1,
      short_summary:
        "An allegorical fantasy series that contains Christian themes, including aspects of Christ's crucifixion and resurrection, set in the fictional realm of Narnia, a land where animals talk and magic is common.",
    },
  ],
};

// Get a list of genres
router.get("/", async (req, res) => {
  try {
    // We'll use our predefined genres instead of querying an AI
    const genres = Object.keys(bookRecommendations);

    // Render the AI page with our genres
    res.render("ai", { genres });
  } catch (error) {
    console.error("❌ Genre API error:", error.message);
    res.render("ai", { genres: [] });
  }
});

// Function to get book cover URL from Open Library
async function getBookCover(isbn) {
  try {
    // Use Open Library Covers API to get book cover by ISBN
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  } catch (error) {
    console.error("❌ Book cover API error:", error);
    return null;
  }
}

// Get books by genre
router.get("/book/:genre", async (req, res) => {
  const genre = req.params.genre;

  try {
    // Get our predefined recommendations for this genre
    let books = bookRecommendations[genre] || [];

    // If we don't have any books for this genre, return empty array
    if (books.length === 0) {
      return res.json({ books: [], genre });
    }

    // Shuffle the books to get different recommendations each time
    books = [...books].sort(() => Math.random() - 0.5).slice(0, 5);

    // Add cover URLs to each book
    for (const book of books) {
      book.cover_url = await getBookCover(book.isbn);
    }

    // Send back the books as JSON
    res.json({ books, genre });
  } catch (error) {
    console.error("❌ Book API error:", error);
    res.json({ books: [], genre });
  }
});

export default router;
