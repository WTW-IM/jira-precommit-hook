import { isWorkEmail } from '../src/user-email-check';

describe('Work Email', () => {
  [
    ['mtscout6@gmail.com', false],
    ['mtscout6@yahoo.com', false],
    ['mtscout6@hotmail.com', false],
    ['mtscout6@customdomain.com', false],
    ['matt.smith@extendhealth.com', true],
    ['matt.smith@towerswatson.com', true],
    ['matt.smith@willistowerswatson.com', true],
    ['matt.smith@ExTeNdHeAlTh.com', true],
    ['matt.smith@ToWeRsWaTsOn.com', true],
    ['matt.smith@WiLlIsToWeRsWaTsOn.com', true]
  ].forEach(([email, expected]) => {
    it(`${email} is ${expected ? '' : 'not'} a work email`, () => {
      isWorkEmail(email).should.equal(expected);
    });
  });
});
