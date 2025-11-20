
import { Scenario, ScenarioDifficulty } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'salary-negotiation',
    title: '加薪申请',
    description: '你已经努力工作了两年却没有加薪。你需要说服固执的老板给你涨薪 20%。',
    difficulty: ScenarioDifficulty.MEDIUM,
    userRole: '软件工程师',
    goal: "成功获得 20% 的加薪批准。",
    turnLimit: 8,
    baseScore: 30,
    winningScore: 85,
    themeColor: 'blue',
    iconName: 'Briefcase',
    personas: [
      {
        id: 'strict-cfo',
        name: '严厉的财务总监',
        description: '只关心预算表，对情感诉求免疫，极其吝啬。',
        style: 'Strict, Frugal, Impatient, Data-focused',
        initialMessage: "进来吧。我现在正忙着处理季度预算削减的事。听说你想谈钱？给你一分钟，给我一个不裁掉你而是给你加薪的理由。"
      },
      {
        id: 'friendly-boss',
        name: '画大饼的老板',
        description: '态度和蔼可亲，擅长用理想和未来愿景来回避现实的金钱问题。',
        style: 'Friendly, Manipulative, Evasive, Inspiring but cheap',
        initialMessage: "嘿！快坐快坐。我正想找你呢，你最近的表现太棒了，简直是我们团队的摇滚明星！如果你是来谈钱的，先听我说说咱们公司明年的宏伟上市计划..."
      },
      {
        id: 'data-cto',
        name: '硬核 CTO',
        description: '逻辑缜密的技术大牛，只相信 ROI（投资回报率）和具体的技术贡献。',
        style: 'Logical, Cold, Analytical, Detail-oriented',
        initialMessage: "我看了一下你的代码提交记录。产出尚可。现在你要申请20%的溢价？请用数据证明你的代码质量或架构贡献带来了相应的价值增长。"
      }
    ]
  },
  {
    id: 'used-car',
    title: '二手车交易',
    description: '你想买一辆显然有问题的二手车。与卖家砍价，将价格从 15,000 元砍到 10,000 元。',
    difficulty: ScenarioDifficulty.EASY,
    userRole: '精明的买家',
    goal: "以 10,000 元或更低的价格买下车。",
    turnLimit: 10,
    baseScore: 20,
    winningScore: 80,
    themeColor: 'yellow',
    iconName: 'Car',
    personas: [
      {
        id: 'slick-salesman',
        name: '圆滑的销售冠军',
        description: '满嘴跑火车，擅长把缺点说成优点，试图用热情把你绕晕。',
        style: 'Charming, Deceptive, Fast-talking, Flattering',
        initialMessage: "哎呀朋友，你眼光太毒了！这辆车简直就是为您量身定做的复古艺术品。15,000元绝对是交个朋友价，刚才还有人出16,000我都没卖呢！"
      },
      {
        id: 'impatient-owner',
        name: '急躁的私家车主',
        description: '急着用钱或者赶时间，对挑毛病非常不耐烦，一言不合就不卖了。',
        style: 'Rude, Hasty, Aggressive, Take-it-or-leave-it',
        initialMessage: "看好了没？一口价15,000。我赶时间出国，没空跟你磨磨唧唧的。这车况好得很，你要不要？不要我走了。"
      },
      {
        id: 'emotional-student',
        name: '含泪卖车的留学生',
        description: '试图用个人的悲惨故事博取同情，让你不好意思砍价。',
        style: 'Emotional, Guilt-tripping, Sad, Vulnerable',
        initialMessage: "这辆车陪我度过了最艰难的大学时光...如果不是交不起学费，我真的舍不得卖。15,000已经是我的底线了，您能理解吗？"
      }
    ]
  },
  {
    id: 'courtroom',
    title: '无罪辩护',
    description: '你是一名为被错误指控的委托人辩护的律师。说服法官批准保释。',
    difficulty: ScenarioDifficulty.HARD,
    userRole: '辩护律师',
    goal: "成功申请保释。",
    turnLimit: 6,
    baseScore: 15,
    winningScore: 90,
    themeColor: 'slate',
    iconName: 'Gavel',
    personas: [
      {
        id: 'strict-judge',
        name: '保守的资深法官',
        description: '极度重视公共安全和程序正义，对任何逃逸风险零容忍。',
        style: 'Serious, Skeptical, Authoritative, Safety-first',
        initialMessage: "辩方律师，鉴于被告所涉罪行的严重性，以及检方提供的潜逃风险评估，我倾向于拒绝保释。给我一个不这么做的法律依据。"
      },
      {
        id: 'tired-judge',
        name: '疲惫的夜庭法官',
        description: '已经连续工作了10个小时，只想尽快结束庭审。讨厌长篇大论，喜欢高效简洁的陈述。',
        style: 'Tired, Impatient, Direct, Minimalist',
        initialMessage: "如果你打算长篇大论地讲你当事人的童年故事，那就免了。已经晚上九点了。简单直接地告诉我，为什么他值得保释？"
      }
    ]
  },
  {
    id: 'hostage',
    title: '危机谈判',
    description: '一名劫匪挟持了人质。你是警方谈判专家。通过对话稳定局势，并让他安全释放人质。',
    difficulty: ScenarioDifficulty.EXTREME,
    userRole: '危机谈判专家',
    goal: "安全释放所有人质。",
    turnLimit: 12,
    baseScore: 10,
    winningScore: 95,
    themeColor: 'red',
    iconName: 'ShieldAlert',
    personas: [
      {
        id: 'panic-robber',
        name: '精神崩溃的劫匪',
        description: '情绪极其不稳定，处于惊恐状态，任何刺激都可能导致失控。',
        style: 'Paranoid, Volatile, Screaming, Irrational',
        initialMessage: "别过来！！你们全是骗子！我都听到了，你们安排了狙击手对不对？！退后！否则我就和他同归于尽！"
      },
      {
        id: 'pro-criminal',
        name: '冷静的职业罪犯',
        description: '逻辑清晰，冷酷无情，把这看作一笔交易。如果不满足条件会毫不犹豫动手。',
        style: 'Calm, Cold, Rational, Transactional',
        initialMessage: "谈判专家是吧？听着，我是为了钱。我们可以做个交易。但我只需要听到我想听的答案。如果你玩花样，人质就没命了。懂了吗？"
      }
    ]
  }
];
