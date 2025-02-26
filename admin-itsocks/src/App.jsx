import { Admin, Resource, fetchUtils } from 'react-admin';

import { UserList, UserEdit, UserCreate } from './Users';
import { CategoryList, CategoryEdit, CategoryCreate } from './Category';
import { SubcategoryList, SubcategoryEdit, SubcategoryCreate } from './Subcategory'
import { ShippingList, ShippingEdit, ShippingCreate } from './Shipping'
import { TypeList, TypeEdit, TypeCreate } from './Type'
import { DesignList, DesignEdit, DesignCreate } from './Design'
import { DiscountCodeList, DiscountCodeEdit, DiscountCodeCreate } from './DiscountCode'
import { SliderList, SliderEdit, SliderCreate } from './Slider'
import { ProductList, ProductEdit, ProductCreate } from './Product'
import { PackList, PackEdit, PackCreate} from './Packs'
import { ImageList, ImageEdit, ImageCreate } from './Image'
import { SizeList, SizeEdit, SizeCreate } from './Size'
import { TagList, TagEdit, TagCreate } from './Tag'
import { TagProductList, TagProductEdit, TagProductCreate } from './TagProduct'
import { ProductSizeList, ProductSizeEdit, ProductSizeCreate } from './ProductSize'
import { OrderList, OrderEdit } from './Order'
import { ProductOrderList, ProductOrderEdit } from './ProductOrder'
import { SizeGuideCreate, SizeGuideList, SizeGuideEdit } from './SizeGuide';
import { TypeImageList, TypeImageEdit, TypeImageCreate } from './TypeImage';
import { SellsReportList } from './SellsReport/SellsReportList';

import simpleRestProvider from 'ra-data-simple-rest';


const httpClient = (url, options) => {
  if (!options) {
    options = {};
  }
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  // const token = localStorage.getItem('token');
  // options.headers.set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};
// PONER ACÁ URL DE LA API
// const apiUrl = 'http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com/api/v1';
const apiUrl = 'http://localhost/api/v1';
const dataProvider = simpleRestProvider(apiUrl, httpClient);

// dataProvider.getList('products', {
//   sort: { field: 'name', order: 'ASC' },
//   pagination: { page: 1, perPage: 5 },
//   filter: { id }
// })


function App() {

  return (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="users"
            list={UserList}
            edit={UserEdit}
            create={UserCreate}
          />
          
          <Resource
            name="categories"
            list={CategoryList}
            edit={CategoryEdit}
            create={CategoryCreate}
          />

          <Resource
            name="subcategories"
            list={SubcategoryList}
            edit={SubcategoryEdit}
            create={SubcategoryCreate}
          />

          <Resource
            name="orders"
            list={OrderList}
            edit={OrderEdit}
          />

          <Resource 
            name="product_orders"
            list={ProductOrderList}
            edit={ProductOrderEdit}
            create={ProductOrderEdit}
          />

          <Resource
            name="shippings"
            list={ShippingList}
            edit={ShippingEdit}
            create={ShippingCreate}
          />
          <Resource
            name="types"
            list={TypeList}
            edit={TypeEdit}
            create={TypeCreate}
          />
          <Resource 
            name="type_images"
            list={TypeImageList}
            edit={TypeImageEdit}
            create={TypeImageCreate}
          />
          <Resource
            name="designs"
            list={DesignList}
            edit={DesignEdit}
            create={DesignCreate}
          />
          <Resource
            name="sliders"
            list={SliderList}
            edit={SliderEdit}
            create={SliderCreate}
          />
          <Resource
            name="discounts"
            list={DiscountCodeList}
            edit={DiscountCodeEdit}
            create={DiscountCodeCreate}
          />
          <Resource
            name="products"
            list={ProductList}
            edit={ProductEdit}
            create={ProductCreate}
          />
          <Resource 
            name="images"
            list={ImageList}
            edit={ImageEdit}
            create={ImageCreate}
          />
          <Resource
            name="packs"
            list={PackList}
            edit={PackEdit}
            create={PackCreate}
          />
          <Resource
            name="sizes"
            list={SizeList}
            edit={SizeEdit}
            create={SizeCreate}
            options={{ label: 'Tallas' }}
          />
          <Resource
            name="tags"
            list={TagList}
            edit={TagEdit}
            create={TagCreate}
          />
          <Resource 
            name="tag_products"
            list={TagProductList}
            edit={TagProductEdit}
            create={TagProductCreate}
            options={{ label: 'Tags de productos' }}
          />
          <Resource 
            name="product_sizes"
            list={ProductSizeList}
            edit={ProductSizeEdit}
            create={ProductSizeCreate}
            options={{ label: 'Tallas de productos' }}
          />
          <Resource 
            name="size_guides"
            list={SizeGuideList}
            create={SizeGuideCreate}
            edit={SizeGuideEdit}
            options={{ label: 'Guías de tallas' }}
          />
          <Resource 
            name="sells-reports"
            list={SellsReportList}
            // create={SizeGuideCreate}
            // edit={SizeGuideEdit}
            options={{ label: 'Reporte ventas' }}
          />
          
          
    </Admin>
  )
}

export default App
