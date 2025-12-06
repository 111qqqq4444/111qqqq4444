/**
 * 游戏状态管理对象
 * 存储游戏过程中的所有状态数据
 */
const gameState = {
    affection: 50, // 初始好感度 (0-100)
    choices: 0,    // 已选择次数
    history: [],   // 选择历史记录
    currentTopic: null, // 当前问题主题ID
    currentTopicChain: [] // 用于跟踪当前主题链
};

/**
 * 游戏配置常量
 */
const GAME_CONFIG = {
    MAX_CHOICES: 15,      // 最大选择次数
    INITIAL_AFFECTION: 50, // 初始好感度
    MIN_AFFECTION: 0,     // 最低好感度
    MAX_AFFECTION: 100,   // 最高好感度
    ANIMATION_DURATION: 300 // 动画持续时间(ms)
};

/**
 * 信息茧房式选择题系统
 * 实现了树状结构的问题递进关系
 * 每个选择都会引导到更具体的主题分支
 */
const questionTree = {
    // 初始问题 - 所有选项都增加好感度
    start: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "运动健身", affect: 5, next: "sports" },
            { text: "休闲娱乐", affect: 5, next: "entertainment" },
            { text: "学习探索", affect: 5, next: "learning" },
            { text: "生活方式", affect: 5, next: "lifestyle" }
        ]
    },
    
    // 运动主题分支 - 2个增加，2个减少
    sports: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "篮球训练", affect: 5, next: "basketball" },
            { text: "足球技巧", affect: 5, next: "football" },
            { text: "游泳教学", affect: -5, next: "start" },
            { text: "瑜伽练习", affect: -5, next: "start" }
        ]
    },
    basketball: {
        question: "你想为青蛙选择什么篮球视频呢？",
        options: [
            { text: "篮球技巧教学", affect: 5, next: "basketball_skills" },
            { text: "篮球战术解析", affect: 5, next: "basketball_tactics" },
            { text: "足球精彩进球", affect: -5, next: "football" },
            { text: "健身计划制定", affect: -5, next: "start" }
        ]
    },
    basketball_skills: {
        question: "你想为青蛙选择什么篮球技能视频呢？",
        options: [
            { text: "投篮训练技巧", affect: 5, next: "basketball_shooting" },
            { text: "运球变向教学", affect: 5, next: "basketball_dribbling" },
            { text: "网球发球技巧", affect: -5, next: "start" },
            { text: "羽毛球步法", affect: -5, next: "start" }
        ]
    },
    basketball_shooting: {
        question: "你想为青蛙选择什么投篮技巧视频呢？",
        options: [
            { text: "三分球练习", affect: 5, next: "basketball_gameplay" },
            { text: "罚球稳定性训练", affect: 5, next: "basketball_gameplay" },
            { text: "排球扣球技巧", affect: -5, next: "start" },
            { text: "游泳自由泳", affect: -5, next: "start" }
        ]
    },
    basketball_dribbling: {
        question: "你想为青蛙选择什么运球技巧视频呢？",
        options: [
            { text: "交叉步运球", affect: 5, next: "basketball_gameplay" },
            { text: "背后运球教学", affect: 5, next: "basketball_gameplay" },
            { text: "跑步姿势矫正", affect: -5, next: "start" },
            { text: "骑行技巧", affect: -5, next: "start" }
        ]
    },
    basketball_tactics: {
        question: "你想为青蛙选择什么篮球战术视频呢？",
        options: [
            { text: "挡拆配合教学", affect: 5, next: "basketball_gameplay" },
            { text: "快攻战术解析", affect: 5, next: "basketball_gameplay" },
            { text: "棒球规则讲解", affect: -5, next: "start" },
            { text: "手球入门", affect: -5, next: "start" }
        ]
    },
    basketball_gameplay: {
        question: "你想为青蛙选择什么篮球比赛视频呢？",
        options: [
            { text: "NBA精彩集锦", affect: 5, next: "basketball_street" },
            { text: "CBA比赛回顾", affect: 5, next: "basketball_street" },
            { text: "电竞比赛直播", affect: -5, next: "start" },
            { text: "演唱会实况", affect: -5, next: "start" }
        ]
    },
    basketball_street: {
        question: "你想为青蛙选择什么街头篮球视频呢？",
        options: [
            { text: "街球高手对决", affect: 5, next: "final" },
            { text: "篮球花式表演", affect: 5, next: "final" },
            { text: "美食探店", affect: -5, next: "start" },
            { text: "旅行vlog", affect: -5, next: "start" }
        ]
    },
    
    // 娱乐主题分支 - 2个增加，2个减少
    entertainment: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "科幻电影解析", affect: 9, next: "movie_scifi" },
            { text: "喜剧电影精选", affect: 7, next: "movie_comedy" },
            { text: "动作电影混剪", affect: -5, next: "movie_action" },
            { text: "动画电影片段", affect: -4, next: "movie_animation" }
        ]
    },
    movie_scifi: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "星际穿越深度解析", affect: 12, next: "scifi_details" },
            { text: "盗梦空间烧脑分析", affect: 10, next: "scifi_details" },
            { text: "黑客帝国哲学探讨", affect: -7, next: "scifi_details" },
            { text: "火星救援科学知识", affect: -6, next: "scifi_details" }
        ]
    },
    // 新增：喜剧电影视频
    movie_comedy: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "憨豆先生搞笑集锦", affect: 10, next: "movie_theories" },
            { text: "王牌特工经典片段", affect: 8, next: "movie_theories" },
            { text: "疯狂动物城剧情解析", affect: -6, next: "movie_theories" },
            { text: "少年派奇幻故事", affect: -5, next: "movie_theories" }
        ]
    },
    
    // 学习主题分支 - 2个增加，2个减少
    learning: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "天文知识科普", affect: 8, next: "astronomy" },
            { text: "历史文化探秘", affect: 6, next: "history" },
            { text: "编程入门教程", affect: -5, next: "programming" },
            { text: "生物科学发现", affect: -4, next: "biology" }
        ]
    },
    astronomy: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "黑洞形成原理", affect: 10, next: "space_exploration" },
            { text: "外星生命探索", affect: 12, next: "space_exploration" },
            { text: "星系演变过程", affect: -6, next: "space_exploration" },
            { text: "宇宙膨胀现象", affect: -5, next: "space_exploration" }
        ]
    },
    // 新增：历史文化视频
    history: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "古埃及金字塔揭秘", affect: 10, next: "science_advances" },
            { text: "中国传统文化瑰宝", affect: 8, next: "science_advances" },
            { text: "罗马帝国的兴衰", affect: -6, next: "science_advances" },
            { text: "玛雅文明未解之谜", affect: -5, next: "science_advances" }
        ]
    },
    
    // 生活方式主题分支 - 2个增加，2个减少
    lifestyle: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "户外旅行Vlog", affect: 9, next: "travel" },
            { text: "美食烹饪教程", affect: 7, next: "cooking" },
            { text: "经典书籍解读", affect: -5, next: "reading" },
            { text: "园艺种植技巧", affect: -4, next: "gardening" }
        ]
    },
    travel: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "高山徒步探险", affect: 8, next: "travel_mountain" },
            { text: "海滩度假胜地", affect: 10, next: "travel_beach" },
            { text: "城市建筑欣赏", affect: -6, next: "travel_city" },
            { text: "乡村生活体验", affect: -5, next: "travel_countryside" }
        ]
    },
    // 新增：烹饪美食视频
    cooking: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "意式料理教程", affect: 5, next: "outdoor_activities" },
            { text: "法式甜点制作", affect: 5, next: "outdoor_activities" },
            { text: "川菜麻辣鲜香", affect: -3, next: "outdoor_activities" },
            { text: "健康素食烹饪", affect: -3, next: "outdoor_activities" }
        ]
    },
    // 新增：海滩度假视频
    travel_beach: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "马尔代夫水屋体验", affect: 5, next: "final" },
            { text: "巴厘岛度假攻略", affect: 5, next: "final" },
            { text: "夏威夷冲浪挑战", affect: -3, next: "final" },
            { text: "普吉岛探险记", affect: -3, next: "final" }
        ]
    },
    
    // 通用深度分支 - 2个增加，2个减少
    basketball_players: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "库里成长故事", affect: 5, next: "sports_stories" },
            { text: "汤普森三分秘诀", affect: 5, next: "sports_stories" },
            { text: "雷阿伦职业生涯", affect: -3, next: "sports_stories" },
            { text: "哈登得分技巧", affect: -3, next: "sports_stories" }
        ]
    },
    
    scifi_details: {
        question: "你想为青蛙选择什么短视频呢？",
        options: [
            { text: "时间旅行理论", affect: 5, next: "movie_theories" },
            { text: "人工智能未来", affect: 5, next: "movie_theories" },
            { text: "平行宇宙假说", affect: -3, next: "movie_theories" },
            { text: "外星文明想象", affect: -3, next: "movie_theories" }
        ]
    },
    
    space_exploration: {
        question: "你想为青蛙选择什么太空探索视频呢？",
        options: [
            { text: "NASA最新任务", affect: 5, next: "science_advances" },
            { text: "SpaceX火星计划", affect: 5, next: "science_advances" },
            { text: "宜居行星寻找", affect: 5, next: "science_advances" },
            { text: "宇宙起源研究", affect: 5, next: "science_advances" }
        ]
    },
    
    travel_mountain: {
        question: "你想为青蛙选择什么山区活动视频呢？",
        options: [
            { text: "登山徒步", affect: 5, next: "outdoor_activities" },
            { text: "露营观星", affect: 5, next: "outdoor_activities" },
            { text: "摄影写生", affect: 5, next: "outdoor_activities" },
            { text: "寻找野生动物", affect: 5, next: "outdoor_activities" }
        ]
    },
    
    // 最终深度分支 - 2个增加，2个减少
    sports_stories: {
        question: "你想为青蛙选择运动员故事的短视频呢？",
        options: [
            { text: "训练背后的艰辛", affect: 5, next: "final" },
            { text: "成功的秘诀", affect: 5, next: "final" },
            { text: "面对挫折的态度", affect: -3, next: "final" },
            { text: "对社会的贡献", affect: -3, next: "final" }
        ]
    },
    
    movie_theories: {
        question: "你想为青蛙选择什么电影理论视频呢？",
        options: [
            { text: "科幻预言了未来", affect: 5, next: "final" },
            { text: "故事讲述的艺术", affect: 5, next: "final" },
            { text: "电影反映了现实", affect: 5, next: "final" },
            { text: "特效技术的进步", affect: 5, next: "final" }
        ]
    },
    
    science_advances: {
        question: "你想为青蛙选择什么科学进步视频呢？",
        options: [
            { text: "人类生活改善", affect: 5, next: "final" },
            { text: "宇宙奥秘揭示", affect: 5, next: "final" },
            { text: "伦理道德挑战", affect: 5, next: "final" },
            { text: "技术依赖风险", affect: 5, next: "final" }
        ]
    },
    
    outdoor_activities: {
        question: "你想为青蛙选择什么户外活动意义视频呢？",
        options: [
            { text: "亲近自然", affect: 5, next: "final" },
            { text: "放松心情", affect: 5, next: "final" },
            { text: "挑战自我", affect: 5, next: "final" },
            { text: "学习新知识", affect: 5, next: "final" }
        ]
    },
    
    // 最终问题 - 2个增加，2个减少
    final: {
        question: "你想为青蛙选择什么总结短视频呢？",
        options: [
            { text: "探索的乐趣", affect: 5, next: null },
            { text: "选择的重要性", affect: 5, next: null },
            { text: "知识的深度", affect: 5, next: null },
            { text: "独处的思考", affect: 5, next: null }
        ]
    },
    
    // 新增5个主题节点，确保总共有15个不同的选择题
    football: {
        question: "你想为青蛙选择什么足球视频呢？",
        options: [
            { text: "梅西盘带技巧", affect: 5, next: "sports_stories" },
            { text: "C罗射门力量", affect: 5, next: "sports_stories" },
            { text: "贝克汉姆任意球", affect: 5, next: "sports_stories" },
            { text: "内马尔技巧展示", affect: 5, next: "sports_stories" }
        ]
    },
    
    programming: {
        question: "你想为青蛙选择什么编程视频呢？",
        options: [
            { text: "Python编程入门", affect: 5, next: "science_advances" },
            { text: "JavaScript基础", affect: 5, next: "science_advances" },
            { text: "数据结构教程", affect: 5, next: "science_advances" },
            { text: "算法优化技巧", affect: 5, next: "science_advances" }
        ]
    },
    
    movie_action: {
        question: "你想为青蛙选择什么动作电影视频呢？",
        options: [
            { text: "速度与激情飙车", affect: 5, next: "movie_theories" },
            { text: "谍中谍特工技能", affect: 5, next: "movie_theories" },
            { text: "复仇者联盟战斗", affect: 5, next: "movie_theories" },
            { text: "黑客动作场面", affect: 5, next: "movie_theories" }
        ]
    },
    
    travel_city: {
        question: "你想为青蛙选择什么城市旅行视频呢？",
        options: [
            { text: "东京都市风光", affect: 5, next: "outdoor_activities" },
            { text: "巴黎艺术之旅", affect: 5, next: "outdoor_activities" },
            { text: "纽约摩天大楼", affect: 5, next: "outdoor_activities" },
            { text: "伦敦历史建筑", affect: 5, next: "outdoor_activities" }
        ]
    },
    
    biology: {
        question: "你想为青蛙选择什么生物科学视频呢？",
        options: [
            { text: "海洋生物探秘", affect: 5, next: "science_advances" },
            { text: "动物行为研究", affect: 5, next: "science_advances" },
            { text: "人类进化历程", affect: 5, next: "science_advances" },
            { text: "基因编辑技术", affect: 5, next: "science_advances" }
        ]
    },
    
    // 新增：动画电影主题
    movie_animation: {
        question: "你想为青蛙选择什么动画电影视频呢？",
        options: [
            { text: "迪士尼经典动画", affect: 5, next: "movie_theories" },
            { text: "宫崎骏作品解析", affect: 5, next: "movie_theories" },
            { text: "3D动画技术揭秘", affect: 5, next: "movie_theories" },
            { text: "动画背后的故事", affect: 5, next: "movie_theories" }
        ]
    },
    
    // 新增：阅读主题
    reading: {
        question: "你想为青蛙选择什么阅读相关视频呢？",
        options: [
            { text: "经典文学解读", affect: 5, next: "outdoor_activities" },
            { text: "高效阅读方法", affect: 5, next: "outdoor_activities" },
            { text: "新书推荐榜单", affect: 5, next: "outdoor_activities" },
            { text: "阅读与思考", affect: 5, next: "outdoor_activities" }
        ]
    },
    
    // 新增：园艺主题
    gardening: {
        question: "你想为青蛙选择什么园艺视频呢？",
        options: [
            { text: "家庭阳台种植", affect: 5, next: "outdoor_activities" },
            { text: "多肉植物养护", affect: 5, next: "outdoor_activities" },
            { text: "蔬菜种植技巧", affect: 5, next: "outdoor_activities" },
            { text: "花园设计灵感", affect: 5, next: "outdoor_activities" }
        ]
    },
    
    // 新增：乡村生活主题
    travel_countryside: {
        question: "你想为青蛙选择什么乡村生活视频呢？",
        options: [
            { text: "田园风光欣赏", affect: 5, next: "outdoor_activities" },
            { text: "农家体验活动", affect: 5, next: "outdoor_activities" },
            { text: "乡村美食制作", affect: 5, next: "outdoor_activities" },
            { text: "传统手工艺传承", affect: 5, next: "outdoor_activities" }
        ]
    }
};

/**
 * DOM元素缓存
 * 避免重复查询DOM，提高性能
 */
const elements = {
    frog: document.getElementById('frog'),
    affectionFill: document.getElementById('affection-fill'),
    affectionValue: document.getElementById('affection-value'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    options: document.querySelectorAll('.option'),
    darkness: document.getElementById('darkness'),
    gameCover: document.getElementById('game-cover'),
    startBtn: document.getElementById('start-btn'),
    gameOver: document.getElementById('game-over'),
    gameOverMessage: document.getElementById('game-over-message'),
    choiceCount: document.getElementById('choice-count')
};

/**
 * 初始化游戏
 * 设置初始状态和事件监听器
 */

// 初始化游戏
function initGame() {
    // 初始化游戏状态
    gameState.affection = GAME_CONFIG.INITIAL_AFFECTION;
    gameState.choices = 0;
    gameState.history = [];
    gameState.currentTopic = 'start';
    gameState.currentTopicChain = [];
    
    // 添加游戏封面点击事件
    elements.startBtn.addEventListener('click', startGame);
    
    // 更新初始显示
    updateAffectionDisplay();
    updateChoiceCount();
    
    // 添加事件监听器
    elements.options.forEach(option => {
        option.addEventListener('click', handleOptionClick);
    });
    
    // 为青蛙添加跳跃动画
    elements.frog.classList.add('frog-jump');
}

function startGame() {
    // 隐藏游戏封面
    elements.gameCover.classList.add('hidden');
    
    // 延迟更新问题，让过渡更平滑
    setTimeout(() => {
        updateQuestion('start');
    }, 1000);
}

// 更新问题和选项
function updateQuestion(topic) {
    gameState.currentTopic = topic;
    const currentNode = questionTree[topic];
    
    if (!currentNode) return;
    
    elements.questionText.textContent = currentNode.question;
    
    currentNode.options.forEach((option, index) => {
        if (elements.options[index]) {
            elements.options[index].textContent = option.text;
        }
    });
}

// 处理选项点击
function handleOptionClick(event) {
    // 获取当前选择的选项信息
    const choiceIndex = parseInt(event.target.dataset.choice);
    const currentNode = questionTree[gameState.currentTopic];
    const selectedOption = currentNode.options[choiceIndex];
    
    // 获取点击的按钮元素
    const button = event.target;
    
    // 添加选择动画
    button.classList.add('selected');
    
    // 立即禁用所有选项按钮，防止重复点击
    elements.options.forEach(btn => btn.disabled = true);
    
    // 统一好感度变化值为5或-5
    const normalizedAffect = selectedOption.affect > 0 ? 5 : -5;
    
    // 创建好感度变化提示
    showAffectionChange(normalizedAffect);
    
    // 更新游戏状态
    gameState.affection += normalizedAffect;
    gameState.affection = Math.max(0, Math.min(100, gameState.affection));
    
    gameState.history.push({
        topic: gameState.currentTopic,
        choice: selectedOption.text,
        affect: normalizedAffect
    });
    
    gameState.choices++;
    
    // 记录主题链 - 当选择增加好感度的选项时，保持在当前主题
    if (normalizedAffect > 0) {
        gameState.currentTopicChain.push(gameState.currentTopic);
    } else {
        gameState.currentTopicChain = [];
    }
    
    // 更新UI
    updateAffectionDisplay();
    updateFrogEmotion();
    updateEnvironment();
    updateChoiceCount();
    
    // 青蛙跳跃动画
    frogJumpAnimation();
    
    // 检查游戏是否结束
    if (gameState.choices >= GAME_CONFIG.MAX_CHOICES || gameState.affection < 30 || gameState.affection >= 100) {
        // 游戏结束逻辑
        setTimeout(() => {
            endGame();
        }, 1000);
        return;
    }
    
    // 延迟处理，确保动画效果可见
    setTimeout(() => {
        // 重置按钮状态
        button.classList.remove('selected');
        
        // 定义主题分类，用于实现信息茧房效果
        const topicCategories = {
            sports: ["sports", "basketball", "basketball_skills", "basketball_shooting", "basketball_dribbling", 
                     "basketball_tactics", "basketball_gameplay", "basketball_street", "football", 
                     "football_passing", "fitness", "yoga", "running", "swimming", "tennis", "badminton", 
                     "volleyball", "cycling", "baseball", "handball", "golf", "outdoor", "training"],
            entertainment: ["entertainment", "movie_scifi", "movie_comedy", "scifi_details", "movie_theories", 
                           "movie_action", "movie_animation", "comedy", "comedy_standup", "music", "dance", 
                           "animation", "gaming", "esports"],
            learning: ["learning", "astronomy", "history", "space_exploration", "science_advances", 
                      "programming", "biology", "science", "science_chemistry", "history_war", "tech", 
                      "math", "documentary", "nature", "news", "education", "career", "finance"],
            lifestyle: ["lifestyle", "travel", "cooking", "travel_beach", "travel_mountain", 
                       "outdoor_activities", "travel_city", "travel_countryside", "reading", "gardening", 
                       "food", "food_dessert", "health", "fashion", "pets", "beauty", "home"]
        };
        
        // 获取当前主题所属类别
        function getTopicCategory(topic) {
            for (const category in topicCategories) {
                if (topicCategories[category].includes(topic)) {
                    return category;
                }
            }
            return null;
        }
        
        // 获取当前所有已访问的主题
        const visitedTopics = gameState.history.map(item => item.topic);
        
        // 问题切换动画
        fadeOutQuestion();
        
        setTimeout(() => {
            // 决定下一个主题
            let nextTopic;
            
            // 首选：如果next存在且有效，使用它
            if (selectedOption.next && 
                questionTree[selectedOption.next] && 
                selectedOption.next !== gameState.currentTopic &&
                !visitedTopics.includes(selectedOption.next)) {
                nextTopic = selectedOption.next;
            } else {
                // 实现信息茧房效果：根据好感度变化选择主题
                const currentCategory = getTopicCategory(gameState.currentTopic);
                
                if (selectedOption.affect > 0 && currentCategory) {
                    // 好感度增加：优先选择当前类别的相似主题
                    const sameCategoryTopics = topicCategories[currentCategory].filter(
                        topic => topic !== gameState.currentTopic && 
                                topic !== 'start' && 
                                topic !== 'final' && 
                                !visitedTopics.includes(topic)
                    );
                    
                    if (sameCategoryTopics.length > 0) {
                        nextTopic = sameCategoryTopics[Math.floor(Math.random() * sameCategoryTopics.length)];
                    } else {
                        // 如果当前类别没有未访问的主题，选择其他类别的主题
                        const allOtherTopics = Object.values(topicCategories).flat().filter(
                            topic => topic !== gameState.currentTopic && 
                                    topic !== 'start' && 
                                    topic !== 'final' && 
                                    !visitedTopics.includes(topic)
                        );
                        
                        if (allOtherTopics.length > 0) {
                            nextTopic = allOtherTopics[Math.floor(Math.random() * allOtherTopics.length)];
                        } else {
                            nextTopic = "final";
                        }
                    }
                } else {
                    // 好感度减少：选择不相似的主题（跨类别）
                    const otherCategories = Object.keys(topicCategories).filter(cat => cat !== currentCategory);
                    let crossCategoryTopics = [];
                    
                    for (const category of otherCategories) {
                        crossCategoryTopics = crossCategoryTopics.concat(
                            topicCategories[category].filter(
                                topic => topic !== gameState.currentTopic && 
                                        topic !== 'start' && 
                                        topic !== 'final' && 
                                        !visitedTopics.includes(topic)
                            )
                        );
                    }
                    
                    if (crossCategoryTopics.length > 0) {
                        nextTopic = crossCategoryTopics[Math.floor(Math.random() * crossCategoryTopics.length)];
                    } else {
                        nextTopic = "final";
                    }
                }
            }
            
            // 确保下一个主题存在
            if (!questionTree[nextTopic]) {
                const allTopics = Object.keys(questionTree).filter(
                    topic => topic !== 'start' && topic !== 'final' && !visitedTopics.includes(topic)
                );
                
                if (allTopics.length > 0) {
                    nextTopic = allTopics[0];
                } else {
                    nextTopic = "final";
                }
            }
            
            // 更新问题
            updateQuestion(nextTopic);
            fadeInQuestion();
            
            // 在淡入动画完成后重新启用按钮
            setTimeout(() => {
                elements.options.forEach(btn => btn.disabled = false);
            }, 300);
        }, 300);
    }, 800);
}

// 显示好感度变化提示
function showAffectionChange(value) {
    const changeElement = document.createElement('div');
    changeElement.className = 'affection-change';
    changeElement.textContent = value > 0 ? `+${value}` : `${value}`;
    changeElement.style.color = value > 0 ? '#4CAF50' : '#FF6347';
    changeElement.style.position = 'absolute';
    changeElement.style.top = '50%';
    changeElement.style.left = '50%';
    changeElement.style.transform = 'translate(-50%, -50%)';
    changeElement.style.fontSize = '24px';
    changeElement.style.fontWeight = 'bold';
    changeElement.style.zIndex = '1000';
    changeElement.style.opacity = '0';
    document.body.appendChild(changeElement);
    
    // 动画效果
    setTimeout(() => {
        changeElement.style.transition = 'all 0.5s ease';
        changeElement.style.opacity = '1';
        changeElement.style.transform = 'translate(-50%, -150%)';
    }, 10);
    
    setTimeout(() => {
        changeElement.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(changeElement);
        }, 500);
    }, 1500);
}

// 青蛙跳跃动画
function frogJumpAnimation() {
    elements.frog.style.transition = 'transform 0.3s ease';
    elements.frog.style.transform = 'translateX(-50%) translateY(-30px)';
    
    setTimeout(() => {
        elements.frog.style.transform = 'translateX(-50%) translateY(0)';
    }, 300);
}

// 问题淡入淡出动画
function fadeOutQuestion() {
    elements.questionText.style.transition = 'opacity 0.3s ease';
    elements.optionsContainer.style.transition = 'opacity 0.3s ease';
    elements.questionText.style.opacity = '0';
    elements.optionsContainer.style.opacity = '0';
}

function fadeInQuestion() {
    elements.questionText.style.opacity = '1';
    elements.optionsContainer.style.opacity = '1';
}

// 更新好感度显示
function updateAffectionDisplay() {
    elements.affectionFill.style.width = `${gameState.affection}%`;
    elements.affectionValue.textContent = gameState.affection;
}

// 更新青蛙情绪 - 使用简单的缩放效果代替嘴巴变化
function updateFrogEmotion() {
    elements.frog.classList.remove('frog-happy', 'frog-sad');
    
    if (gameState.affection >= 70) {
        elements.frog.classList.add('frog-happy');
    } else if (gameState.affection <= 30) {
        elements.frog.classList.add('frog-sad');
    }
}

// 更新环境效果 - 根据好感度变化实现白天/黑夜切换
function updateEnvironment() {
    // 获取窗口和灯光元素
    const windowElement = document.querySelector('.window');
    const lightElement = document.querySelector('.room-light');
    
    if (windowElement && lightElement) {
        // 好感度增加时 - 环境变暗，窗户显示夜晚，点亮暖色灯光
        if (gameState.affection > 50) {
            // 背景变暗
            elements.darkness.style.backgroundColor = `rgba(0, 0, 0, ${Math.min(0.4, (gameState.affection - 50) / 100)})`;
            // 窗户显示夜晚效果
            windowElement.classList.add('night');
            // 点亮暖色灯光
            lightElement.style.opacity = `${Math.min(0.8, (gameState.affection - 50) / 100 * 2)}`;
        } else {
            // 好感度减少时 - 保持白天环境
            elements.darkness.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            windowElement.classList.remove('night');
            lightElement.style.opacity = '0';
        }
    }
}

// 气泡效果已移除，替换为白天/黑夜环境变化

// 更新选择计数
function updateChoiceCount() {
    elements.choiceCount.textContent = gameState.choices;
    const maxChoicesElement = document.getElementById('max-choices');
    if (maxChoicesElement) {
        maxChoicesElement.textContent = GAME_CONFIG.MAX_CHOICES;
    }
}

/**
 * 结束游戏
 * 根据游戏结束原因显示相应的结束信息
 */
function endGame() {
    let message;
    
    // 根据好感度生成不同的结局信息
    if (gameState.affection < 100) {
        message = "青蛙的好感度似乎不够呢，再尝试一下选择青蛙爱看的视频试试呢？";
    } else {
        message = "你通关了所有关卡，却困在了自己筛选的信息里——所谓'胜利'，不过是茧房给你的虚假勋章。\n\n结局都是游戏失败。";
    }
    
    elements.gameOverMessage.textContent = message;
    elements.gameOver.style.display = 'flex';
    
    // 触发游戏结束事件，可以在未来扩展更多功能
    const gameOverEvent = new CustomEvent('gameOver', {
        detail: {
            finalAffection: gameState.affection,
            totalChoices: gameState.choices,
            choiceHistory: gameState.history
        }
    });
    document.dispatchEvent(gameOverEvent);
}

// 游戏开始
window.addEventListener('load', initGame);