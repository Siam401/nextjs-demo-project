import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setHead, setItemList } from '@/features/simple/itemSlice'

const ItemSearch = () => {
  const searchField = useRef<HTMLInputElement>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const dispatch = useDispatch();

  const handleSearch = async () => {
    searchData(searchField.current ? searchField.current.value : '');

    async function searchData(search: string) {
      await axios.get(BASE_URL + `simple/items?term=` + search).then(({ data }) => {
        dispatch(setItemList(data.data))
      })
    }
  };

  const items: any = useSelector<object[]>((state: any) => state.item.items);

  return (
    <div className="justify-between md:flex">
      <div className="mt-3 w-full md:w-1/2">
        Showing All Items({items.length})
      </div>
      <div className="w-full md:w-1/2">
        <input
          type="text"
          className="px-2 py-3 border w-full mt-3 md:mt-0"
          ref={searchField}
          onKeyUp={handleSearch}
          placeholder="Search item"
        />
      </div>
    </div>
  );
};

export default ItemSearch;
