import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import styled from 'styled-components';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { filterThisMonth, readSchedule } from './redux/modules/schedule';
import Day from './Day';
const Calendar = ({ history }) => {
  const { thisMonth } = useSelector((state) => state.schedule);
  const [today, setToday] = useState(moment());
  const dispatch = useDispatch();

  useEffect(() => {
    const startDay = today.clone().startOf('month').format('YYYYMMDD');
    const endDay = today.clone().endOf('month').format('YYYYMMDD');
    dispatch(readSchedule({ startDay, endDay }));
  }, [today, dispatch]);

  const movePrevMonth = () => {
    setToday(today.clone().subtract(1, 'month'));
    const startDay = today
      .clone()
      .subtract(1, 'months')
      .startOf('month')
      .format('YYYYMMDD');
    const endDay = today
      .clone()
      .subtract(1, 'months')
      .endOf('month')
      .format('YYYYMMDD');

    dispatch(filterThisMonth({ startDay, endDay }));
  };

  const moveNextMonth = () => {
    setToday(today.clone().add(1, 'month'));

    const startDay = today
      .clone()
      .add(1, 'months')
      .startOf('month')
      .format('YYYYMMDD');
    const endDay = today
      .clone()
      .add(1, 'months')
      .endOf('month')
      .format('YYYYMMDD');

    dispatch(filterThisMonth({ startDay, endDay }));
  };
  const goToAddSchedule = () => {
    history.push('/addSchedule');
  };
  const generate = () => {
    // 일년은 52주
    const startWeek = today.clone().startOf('month').week();
    const endWeek =
      today.clone().endOf('month').week() === 1
        ? 53
        : today.clone().endOf('month').week();

    // 날짜
    let calendar = [];

    for (let w = startWeek; w <= endWeek; w++) {
      calendar.push(
        <Weekend key={w}>
          {Array(7)
            .fill(0)
            .map((n, idx) => {
              let day = today
                .clone()
                .startOf('year')
                .week(w)
                .startOf('week')
                .add(idx, 'day')
                .format('D');

              let fullDate = today
                .clone()
                .startOf('year')
                .week(w)
                .startOf('week')
                .add(idx, 'day')
                .format('l')
                .replaceAll('.', '');

              const todaySch = thisMonth.filter((s) => {
                return s.date === fullDate;
              });

              const dateInfo = { day, fullDate, dow: idx, todaySch };
              return <Day key={n + idx} dateInfo={dateInfo}></Day>;
            })}
        </Weekend>
      );
    }
    return calendar;
  };

  return (
    <div>
      <CalendarWrapper>
        <Header>
          <MdChevronLeft
            className="dir"
            onClick={movePrevMonth}
          ></MdChevronLeft>
          <span>{today.format('MMMM')}</span>
          <MdChevronRight
            className="dir"
            onClick={moveNextMonth}
          ></MdChevronRight>
        </Header>
        <DateContainer>
          <Weekend className="row">
            <Dow color="#ff4b4b">
              <span>S</span>
            </Dow>
            <Dow>
              <span>M</span>
            </Dow>
            <Dow>
              <span>T</span>
            </Dow>
            <Dow>
              <span>W</span>
            </Dow>
            <Dow>
              <span>T</span>
            </Dow>
            <Dow>
              <span>F</span>
            </Dow>
            <Dow color="#4b87ff">
              <span>S</span>
            </Dow>
          </Weekend>
          {generate()}
        </DateContainer>
      </CalendarWrapper>
      <AddButton onClick={goToAddSchedule}>+</AddButton>
    </div>
  );
};

const CalendarWrapper = styled.div`
  position: relative;
`;

const Header = styled.div`
  height: 7vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 3px;
  font-size: 1.5em;

  & > span {
    margin: 0 100px;
  }
  & > .dir {
    color: #cccccc;

    &:hover {
      cursor: pointer;
    }
  }
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1vw;
`;

const Weekend = styled.div`
  display: flex;
`;

const Dow = styled.div`
  border-bottom: 1px solid gray;
  width: 100%;
  height: 35px;
  color: ${(props) => (props.color ? props.color : 'black')};
  text-align: center;
  & span {
  }
`;

const AddButton = styled.div`
  position: absolute;
  z-index: 1;
  right: 0;
  margin: 10px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-align: center;
  background-color: skyblue;
`;
export default Calendar;
