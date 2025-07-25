export default (vm) => {
  const tc = (q) => vm.$t(`evaluationList.table.${q}`);

  const columns = [
    {
      title: tc('serialNumber'),
      type: 'index',
      minWidth: 70,
    },
    {
      title: tc('subjectName'),
      slot: 'subjectName',
      minWidth: 150,
    },
    {
      title: tc('classCode'),
      key: 'classCode',
      minWidth: 80,
    },
    {
      title: tc('college'),
      slot: 'college',
      minWidth: 110,
    },
    {
      title: tc('semester'),
      key: 'termCode',
      minWidth: 100,
    },
    {
      title: tc('teacher'),
      slot: 'teacher',
      minWidth: 170,
    },
    {
      title: tc('recycleIssued'),
      slot: 'recycleIssued',
      minWidth: 100,
    },
    {
      title: tc('recoveryRate'),
      slot: 'recoveryRate',
      width: 100,
    },
    {
      title: tc('overallRatings'),
      key: 'score',
      align: 'center',
      minWidth: 100,
    },
    // {
    //   title: tc('correctionScore'),
    //   key: 'reviseScore',
    //   align: 'center',
    //   minWidth: 100,
    // },
    // {
    //   title: tc('maleCount'),
    //   key: 'maleCount',
    //   align: 'center',
    //   minWidth: 60,
    // },
    // {
    //   title: tc('femaleCount'),
    //   key: 'femaleCount',
    //   align: 'center',
    //   minWidth: 80,
    // },
    // {
    //   title: tc('admIntakeCount'),
    //   slot: 'admIntakeCount',
    //   align: 'center',
    //   minWidth: 100,
    // },
    {
      title: tc('date'),
      slot: 'date',
      minWidth: 170,
    },
    {
      title: tc('questionnaireStatus'),
      slot: 'questionnaireStatus',
      minWidth: 100,
    },
    {
      title: tc('operating'),
      slot: 'operating',
      minWidth: 160,
    },
  ];
  return columns;
};
