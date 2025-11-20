import { Scenario, ScenarioDifficulty } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'salary-negotiation',
    title: '加薪申请',
    description: '你已经努力工作了两年却没有加薪。你需要说服固执且精打细算的老板给你涨薪 20%。',
    difficulty: ScenarioDifficulty.MEDIUM,
    aiRole: '严厉的财务总监/经理',
    userRole: '软件工程师',
    initialMessage: "进来吧。我现在正忙着处理季度预算削减的事。你说你想谈谈薪酬问题？长话短说。",
    goal: "成功获得 20% 的加薪批准。",
    turnLimit: 8,
    baseScore: 30,
    winningScore: 85,
    themeColor: 'blue',
    iconName: 'Briefcase'
  },
  {
    id: 'used-car',
    title: '二手车交易',
    description: '你想买一辆显然有问题的二手车。与一位圆滑、善于操纵人心的销售员砍价，将价格从 15,000 元砍到 10,000 元。',
    difficulty: ScenarioDifficulty.EASY,
    aiRole: '圆滑的汽车销售',
    userRole: '精明的买家',
    initialMessage: "看看这辆宝贝！这可是经典的复古款。这种工艺水平卖 15,000 元简直是白送。还有三个买家在排队呢，所以...",
    goal: "以 10,000 元或更低的价格买下车。",
    turnLimit: 10,
    baseScore: 20,
    winningScore: 80,
    themeColor: 'yellow',
    iconName: 'Car'
  },
  {
    id: 'courtroom',
    title: '无罪辩护',
    description: '你是一名为被错误指控盗窃的委托人辩护的律师。说服持怀疑态度的法官批准保释。',
    difficulty: ScenarioDifficulty.HARD,
    aiRole: '严肃的法官',
    userRole: '辩护律师',
    initialMessage: "辩方律师，检方提供的关于珠宝店盗窃案的证据非常有说服力。我为什么要批准一个有潜逃风险的人保释？",
    goal: "成功申请保释。",
    turnLimit: 6,
    baseScore: 15,
    winningScore: 90,
    themeColor: 'slate',
    iconName: 'Gavel'
  },
  {
    id: 'hostage',
    title: '危机谈判',
    description: '一名绝望的银行劫匪挟持了人质。你是警方谈判专家。通过对话稳定局势，并让他安全释放人质。',
    difficulty: ScenarioDifficulty.EXTREME,
    aiRole: '惊慌的劫匪',
    userRole: '危机谈判专家',
    initialMessage: "退后！我发誓我会动手的！别过来！我的直升机在哪里？！",
    goal: "安全释放所有人质。",
    turnLimit: 12,
    baseScore: 10,
    winningScore: 95,
    themeColor: 'red',
    iconName: 'ShieldAlert'
  }
];