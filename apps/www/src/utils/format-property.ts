import _ from 'lodash';

export const formatPropertyType = (text: string) =>
  _.replace(_.startCase(_.toLower(text)), ' ', '');
