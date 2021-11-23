import { Brastlewark, FriendsData, FilterData, SelectedFilterData, State, FilterState } from "../interfaces/appInterfaces";
import { PersonEnum } from "./enums";


export const getPersonsListByName = (data: any): Brastlewark[] => {
  const {name, globalData} = data;
  return globalData
    .filter((person: Brastlewark) => person.name.toUpperCase().includes(name.toUpperCase()));
}

export const getPersonData = (personId: number, response: Brastlewark[]): any => {
  return response.find((brastlewark: Brastlewark) => brastlewark.id === personId) as Brastlewark;
}

export const getFriendsList = (friendsList: string[], brastlewarkData: Brastlewark[]): FriendsData[] => {
  const friendsListData: FriendsData[] = [];
  friendsList.forEach((friendName: string) => {
    const friendData: Brastlewark = brastlewarkData.find(person => person.name === friendName) as Brastlewark;
    friendData && friendsListData.push({id: friendData.id, thumbnail: friendData.thumbnail})
  });
  return friendsListData;
}

export const getFilterData = (globalData: Brastlewark[]): FilterData => {
  let hair_color: string[] = [];
  let professions: string[] = [];
  let ageMaxValue: number = 0;
  let ageMinValue: number = 1000000;
  let weightMaxValue: number = 0;
  let weightMinValue: number = 1000000;
  let heightMaxValue: number = 0;
  let heightMinValue: number = 1000000;

  globalData.forEach((person: Brastlewark) => {
    professions = Array.from(new Set(professions.concat(...person?.professions || [])));
    !hair_color.includes(person.hair_color) && hair_color.push(person.hair_color);
    if (Math.round(person.age) > ageMaxValue) ageMaxValue = Math.round(person.age);
    if (Math.round(person.age) < ageMinValue) ageMinValue = Math.round(person.age);
    if (Math.round(person.weight) > weightMaxValue) weightMaxValue = Math.round(person.weight);
    if (Math.round(person.weight) < weightMinValue) weightMinValue = Math.round(person.weight);
    if (Math.round(person.height) > heightMaxValue) heightMaxValue = Math.round(person.height);
    if (Math.round(person.height) < heightMinValue) heightMinValue = Math.round(person.height);
  });

  return {hair_color, professions, ranges: {
    ageMaxValue,
    ageMinValue,
    weightMaxValue,
    weightMinValue,
    heightMaxValue,
    heightMinValue
  }};
};

export const getListDataFromFilter = (filterData: FilterState, globalData: Brastlewark[]) => {
  const hair_color = filterData.multiSelectValue[PersonEnum.HAIR_COLOR];
  const weight = filterData.slidersData[PersonEnum.WEIGHT];
  const height = filterData.slidersData[PersonEnum.HEIGHT];
  const age = filterData.slidersData[PersonEnum.AGE];
  const professions = filterData.multiSelectValue[PersonEnum.PROFESSION];
  const { personName: name } = filterData
  let list: Brastlewark[] = globalData;
  if(!!name) {
    list = list.filter((person: Brastlewark)=> person.name.toUpperCase().includes(name.toUpperCase()))
  }

  if(age.length) {
    list = list.filter((person: Brastlewark) => person.age >= age[0] && person.age <= age[1])
  }

  if(weight.length) {
    list = list.filter((person: Brastlewark) => person.weight >= weight[0] && person.weight <= weight[1])
  }
  
  if(height.length) {
    list = list.filter((person: Brastlewark) => person.height >= height[0] && person.height <= height[1])
  }

  if (hair_color.length) {
    list = list.filter((person: Brastlewark) => hair_color.includes(person.hair_color))
  }

  if (professions.length) {
    list = list.filter((person: Brastlewark) => person.professions.filter((profession: string) => professions.includes(profession)).length > 0)
  }
  debugger;

  return list
}