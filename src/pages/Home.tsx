import React from 'react';
import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

/* import Sort from '../components/Sort';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';
import NotFoundItems from '../components/NotFoundItemsBlock'; */
import { Categories, PizzaBlock, Skeleton, Pagination, Sort, NotFoundItems } from '../components';
import { useAppDispatch } from '../redux/store';
import { selectFilterState, selectPizzaData } from '../redux/filter/selectors';
import { setCategoryId, setCurrentPage } from '../redux/filter/slice';
import { fetchPizzas } from '../redux/pizza/asyncActions';

const Home: React.FC = () => {
  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilterState);
  const { items, status } = useSelector(selectPizzaData);
  const dispatch = useAppDispatch();

  const onChangePage = (number: number) => {
    dispatch(setCurrentPage(number));
  };
  const onChangeCategory = useCallback((id: number) => {
    dispatch(setCategoryId(id));
    /* eslint-disable */
  }, []);
  const getPizzas = async () => {
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const sortBy = sort.sortProperty.replace('-', '');
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    dispatch(
      fetchPizzas({
        order,
        sortBy,
        category,
        search,
        currentPage,
      }),
    );
    window.scrollTo(0, 0);
  };

  const pizzas = items.map((el: any) => <PizzaBlock key={el.id} {...el} />);
  const skeletons = [...new Array(4)].map((_, index) => <Skeleton key={index} />);

  useEffect(() => {
    getPizzas();
    /* eslint-disable */
  }, [categoryId, sort.sortProperty, currentPage, searchValue]);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onChangeCategory} />

        <Sort value={sort} />
      </div>
      <h2 className="content__title">All pizzas</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>something's wrong🤔</h2>
          <p>failed to receive the goods. Please, try again later</p>
        </div>
      ) : searchValue !== '' && pizzas.length === 0 ? (
        <NotFoundItems />
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
      )}

      {categoryId === 0 ? (
        <Pagination currentPage={currentPage} onChangePage={onChangePage} />
      ) : null}
    </div>
  );
};

export default Home;
