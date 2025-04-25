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
