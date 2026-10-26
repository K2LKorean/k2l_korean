/* ============ LEVELS — edit this file to add words and grammar ============
 Each level: id, t (title), v (words "한글|romanization|meaning"),
 g (grammar: p pattern, m meaning, n note, x [example, translation],
    q [sentence with ___, correct answer, ...wrong answers])
 To add a level, copy one block and change it. */
const DATA=[
{id:'1A',t:'Level 1A',v:['안녕하세요|annyeonghaseyo|hello','감사합니다|gamsahamnida|thank you','학생|haksaeng|student','선생님|seonsaengnim|teacher','물|mul|water','밥|bap|rice, meal','사람|saram|person','한국|hanguk|Korea','이름|ireum|name','네|ne|yes','아니요|aniyo|no','커피|keopi|coffee'],
 g:[{p:'이에요 / 예요',m:'to be (A is B)',n:'Use 이에요 after a final consonant and 예요 after a vowel.',x:['저는 학생이에요.','I am a student.'],q:['저는 학생___.','이에요','예요']},
    {p:'은 / 는',m:'topic marker',n:'은 after a consonant, 는 after a vowel. Marks what the sentence is about.',x:['저는 한국 사람이에요.','I am Korean.'],q:['저___ 선생님이에요.','는','은']},
    {p:'을 / 를',m:'object marker',n:'을 after a consonant, 를 after a vowel. Marks what receives the action.',x:['물을 마셔요.','I drink water.'],q:['커피___ 마셔요.','를','을']}]},
{id:'1B',t:'Level 1B',v:['먹다|meokda|to eat','마시다|masida|to drink','가다|gada|to go','오다|oda|to come','보다|boda|to see, watch','학교|hakgyo|school','집|jip|home','오늘|oneul|today','내일|naeil|tomorrow','친구|chingu|friend','좋아요|joayo|good, I like it'],
 g:[{p:'-아요 / -어요',m:'polite present tense',n:'Remove 다. If the last vowel is ㅏ or ㅗ add 아요, otherwise 어요. 가다 → 가요.',x:['밥을 먹어요.','I eat a meal.'],q:['밥을 (먹다) → ___','먹어요','먹아요']},
    {p:'에',m:'to a place, at a time',n:'Use 에 with 가다, 오다 and times.',x:['학교에 가요.','I go to school.'],q:['집___ 가요.','에','에서']},
    {p:'에서',m:'at a place (action happens there)',n:'Use 에서 when an action takes place at a location.',x:['도서관에서 공부해요.','I study at the library.'],q:['학교___ 공부해요.','에서','에']}]},
{id:'2A',t:'Level 2A',v:['주말|jumal|weekend','시간|sigan|time','같이|gachi|together','어제|eoje|yesterday','여행|yeohaeng|trip, travel','음식|eumsik|food','일|il|work, task','비싸다|bissada|to be expensive','맛있다|masitda|to be delicious','만나다|mannada|to meet'],
 g:[{p:'-았/었어요',m:'past tense',n:'Take the polite present stem and change 어요 to 었어요 (or 아요 to 았어요).',x:['어제 영화를 봤어요.','I watched a movie yesterday.'],q:['어제 친구를 (만나다) → ___','만났어요','만나요','만날 거예요']},
    {p:'-(으)ㄹ 거예요',m:'future, plan',n:'After a vowel add ㄹ 거예요, after a consonant add 을 거예요.',x:['내일 갈 거예요.','I will go tomorrow.'],q:['내일 여행을 ___','갈 거예요','갔어요','가요']},
    {p:'-고 싶다',m:'want to (do)',n:'Attach to the verb stem. Only for your own wishes.',x:['커피를 마시고 싶어요.','I want to drink coffee.'],q:['한국에 가___ 싶어요.','고','서','지만']}]},
{id:'2B',t:'Level 2B',v:['약속|yaksok|appointment, promise','준비|junbi|preparation','이유|iyu|reason','경험|gyeongheom|experience','걱정|geokjeong|worry','바쁘다|bappeuda|to be busy','필요하다|piryohada|to need','어렵다|eoryeopda|to be difficult','쉽다|swipda|to be easy','기다리다|gidarida|to wait'],
 g:[{p:'-아/어서',m:'because, so',n:'Gives a reason. Cannot be used with commands or suggestions.',x:['바빠서 못 가요.','I am busy so I cannot go.'],q:['비가 와___ 안 가요.','서','지만','니까']},
    {p:'-(으)니까',m:'because (reason for a command)',n:'Works with commands and suggestions, unlike -아/어서.',x:['비가 오니까 우산을 가져가세요.','It is raining, so take an umbrella.'],q:['시간이 없___ 빨리 가요.','으니까','지만','고']},
    {p:'-지만',m:'but, although',n:'Attach to the stem to contrast two ideas.',x:['어렵지만 재미있어요.','It is hard but fun.'],q:['맛있___ 비싸요.','지만','서','으니까']}]},
{id:'3A',t:'Level 3A',v:['경제|gyeongje|economy','문화|munhwa|culture','환경|hwangyeong|environment','관계|gwangye|relationship','결정|gyeoljeong|decision','의견|uigyeon|opinion','변화|byeonhwa|change','영향|yeonghyang|influence, effect','포기하다|pogihada|to give up','노력하다|noryeokhada|to make an effort'],
 g:[{p:'-는 것 같다',m:'it seems that',n:'Present verbs take 는, adjectives take (으)ㄴ. A softened guess.',x:['비가 오는 것 같아요.','It seems to be raining.'],q:['지금 비가 오___ 것 같아요.','는','은','ㄹ']},
    {p:'-(으)려고',m:'in order to',n:'Intention behind an action. Same subject in both clauses.',x:['한국어를 배우려고 왔어요.','I came to learn Korean.'],q:['친구를 만나___ 왔어요.','려고','지만','니까']},
    {p:'-(으)ㄹ 수 있다',m:'can, be able to',n:'Use 없다 for the negative: 할 수 없어요.',x:['한국어를 할 수 있어요.','I can speak Korean.'],q:['저는 수영을 할 ___ 있어요.','수','것','거']}]}
];
