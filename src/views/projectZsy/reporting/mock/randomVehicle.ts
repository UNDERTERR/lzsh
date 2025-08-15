// 随机数据生成工具
export const generateRandomVehicle = () => {
  const prefixes = ['甘A', '甘B', '甘C', '甘D', '甘E'];
  const vehicleTypes = ['私家车', '三轮车', '微型货车', '中型货车', '大型货车'];
  const unloadingTypes = ['人工卸货', '机械卸货', '混合卸货'];
  const cargoTypes = ['水果', '肉类', '蔬菜', '水产'];
  const cargoNames: { [key: string]: string[] } = {
    '水果': ['苹果', '香蕉', '橙子', '西瓜'],
    '肉类': ['猪肉', '牛肉', '羊肉', '鸡肉'],
    '蔬菜': ['白菜', '萝卜', '土豆', '西红柿'],
    '水产': ['草鱼', '巴沙鱼', '黑鱼', '花鲢']
  };
  const cities = ['甘肃省兰州市', '甘肃省嘉峪关市', '甘肃省金昌市', '甘肃省白银市', '甘肃省天水市'];
  
  // 日期计算工具函数
  const addRandomTime = (baseDate: Date, options: { 
    days?: number, 
    hours?: number, 
    minutes?: number,
    maxMillis?: number
  }) => {
    const newDate = new Date(baseDate);
    if (options.days) newDate.setDate(newDate.getDate() + options.days);
    if (options.hours) newDate.setHours(newDate.getHours() + options.hours);
    if (options.minutes) newDate.setMinutes(newDate.getMinutes() + options.minutes);
    if (options.maxMillis) newDate.setTime(newDate.getTime() + Math.random() * options.maxMillis);
    return newDate;
  };

  // 生成随机报备时间
  const generateReportTime = () => {
    return addRandomTime(new Date(), {
      days: -(Math.floor(Math.random() * 3) + 1),
      hours: -Math.floor(Math.random() * 24),
      minutes: -Math.floor(Math.random() * 60)
    }).toISOString();
  };

  // 生成预计入场时间
  const generateEstimatedArrival = (reportTime: string) => {
    const date = addRandomTime(new Date(reportTime), {
      days: Math.floor(Math.random() * 7) + 1
    });
    date.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60));
    return date.toISOString();
  };

  // 设置后续步骤状态
  const setRemainingSteps = (steps: any[], lastCompletedIndex: number) => {
    return steps.map((step, index) => 
      index <= lastCompletedIndex ? step : { ...step, result: '未开始' }
    );
  };

  // 电话号码工具函数
  const generatePhone = (prefix: string) => {
    return prefix + Math.floor(Math.random() * 10000000000)
      .toString()
      .padStart(10, '0')
      .substring(0, 11 - prefix.length);
  };

  // 档口工具函数
  const generateStall = (cargoType: string) => {
    return `${cargoType}区${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 10) + 1}号`;
  };

  // 生成审批步骤
  const generateApprovalSteps = (reportTime: string) => {
    const steps = [
      { step: '报备审核', result: '', officer: '', remark: '', risk_level: '', time: '' },
      { step: '车辆消杀', result: '', officer: '', remark: '', time: '' },
      { step: '进场核验', result: '', officer: '', remark: '', time: '' },
      { step: '车辆入场', result: '', officer: '', remark: '', time: '' },
      { step: '车辆出场', result: '', officer: '', remark: '', time: '' }
    ];

    const baseDate = new Date(reportTime);

    // 报备审核
    const firstStepPass = Math.random() > 0.1; // 90%通过率
    steps[0] = {
      ...steps[0],
      result: firstStepPass ? '通过' : '驳回',
      officer: `审核员${Math.floor(Math.random() * 20)}`,
      remark: firstStepPass ? '材料齐全，审核通过' : '材料不符合要求，驳回',
      risk_level: firstStepPass ? ['低', '中', '高'][Math.floor(Math.random() * 3)] : '',
      time: addRandomTime(baseDate, { maxMillis: 86400000 }).toISOString() // 24小时内
    };
    
    if (!firstStepPass) return setRemainingSteps(steps, 0);

    // 车辆消杀
    const secondStepComplete = Math.random() > 0.1; // 90%完成率
    steps[1] = {
      ...steps[1],
      result: secondStepComplete ? '已消杀' : '待消杀',
      officer: secondStepComplete ? `消杀员${Math.floor(Math.random() * 20)}` : '',
      remark: secondStepComplete ? '消杀已完成' : '',
      time: secondStepComplete 
        ? addRandomTime(new Date(steps[0].time), { maxMillis: 3600000 }).toISOString() 
        : ''
    };
    
    if (!secondStepComplete) return setRemainingSteps(steps, 1);

    // 进场核验
    const thirdStepPass = Math.random() > 0.1; // 90%通过率
    steps[2] = {
      ...steps[2],
      result: thirdStepPass ? '通过' : '不通过',
      officer: `核验员${Math.floor(Math.random() * 20)}`,
      remark: thirdStepPass ? '核验通过' : '信息不符，核验不通过',
      time: addRandomTime(new Date(steps[1].time), { maxMillis: 1800000 }).toISOString()
    };
    
    if (!thirdStepPass) return setRemainingSteps(steps, 2);

    // 车辆入场
    const fourthStepPass = Math.random() > 0.1; // 90%通过率
    steps[3] = {
      ...steps[3],
      result: fourthStepPass ? '已入场' : '待入场',
      officer: `引导员${Math.floor(Math.random() * 20)}`,
      remark: fourthStepPass ? '顺利入场' : '场地繁忙，暂时无法入场',
      time: addRandomTime(new Date(steps[2].time), { maxMillis: 1800000 }).toISOString()
    };
    
    if (!fourthStepPass) return setRemainingSteps(steps, 3);

    // 车辆出场
    const shouldProceedToExit = Math.random() > 0.7; // 30%进入出场流程
    if (shouldProceedToExit) {
      const exited = Math.random() > 0.35; // 65%已出场
      steps[4] = {
        ...steps[4],
        result: exited ? '已出场' : '待出场',
        officer: exited ? `管理员${Math.floor(Math.random() * 20)}` : '',
        remark: exited ? '正常离场' : '等待离场',
        time: exited 
          ? addRandomTime(new Date(steps[3].time), { maxMillis: 259200000 }).toISOString() 
          : ''
      };
    }
    return steps;
  };

  const cargoType = cargoTypes[Math.floor(Math.random() * cargoTypes.length)];
  const intended_stall = generateStall(cargoType);
  
  // 生成报备时间
  const report_time = generateReportTime();
  
  // 生成预计入场时间
  const estimated_arrival = generateEstimatedArrival(report_time);
  
  // 生成审批步骤
  const steps = generateApprovalSteps(report_time);
  const isApproved = steps[0].result === '通过';
  const isRejected = steps[0].result === '驳回';
  
  // 根据审批状态分配实际档口
  let assigned_stall = '';
  if (isApproved) {
    assigned_stall = Math.random() > 0.3 ? intended_stall : generateStall(cargoType);
  } else if (!isRejected) {
    assigned_stall = '待分配';
  }
  
  return {
    id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
    license_plate: `${prefixes[Math.floor(Math.random() * prefixes.length)]}${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    vehicle_type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
    unloading_type: unloadingTypes[Math.floor(Math.random() * unloadingTypes.length)],
    driver_name: `驾驶员${Math.floor(Math.random() * 100)}`,
    driver_phone: generatePhone('13'),
    cargo_departure: `甘肃省${cities[Math.floor(Math.random() * cities.length)]}`,
    estimated_arrival,
    estimated_stay_days: Math.floor(Math.random() * 5) + 1,
    intended_stall,
    assigned_stall,
    cargo_type: cargoType,
    cargo_name: cargoNames[cargoType]?.[Math.floor(Math.random() * (cargoNames[cargoType]?.length || 1))] || '未知',
    cargo_weight: Math.floor(Math.random() * 1000) + 100,
    has_attendant: Math.random() > 0.5 ? '是' : '否',
    stall_contact: `工作人员${Math.floor(Math.random() * 10)}`,
    stall_phone: generatePhone('139'),
    report_time,
    update_time: report_time, 
    is_imported: Math.random() > 0.7 ? '已进口' : '未进口',
    approval_steps: steps
  };
};

// 异步生成随机列表
export const fetchRandomVehicles = async (count: number = 10) => {
  // 模拟网络延迟
  return new Promise(resolve => {
    setTimeout(() => {
      const result = Array.from({ length: count }, () => generateRandomVehicle());
      resolve(result);
    }, 800);
  });
};