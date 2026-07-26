# Personal Note:
1. Create a project with expo
2. Build an application
3. Basic component in react native
4. Hooks useEffect(), userState()
5. Call api by fetch()
6. Define an interface for data's shape
7. Using StyleSheet.create() of react-native to create style properties for elements
8. Write inline style
9. Use Record object to create const varaiable
10. Link, use property "params" to sent data to a path. Then in destination path, call useLocalSearchParams() to get the data.
11. Multiple way to show page by change value of property "presentation" in Stack.Screen

## Ponders

### `interface` vs `type` vs `class`

**`interface`** — mô tả hình dạng (shape) của dữ liệu

```ts
interface Pokemon {
  id: number;
  name: string;
  types: string[];
}
```
- Chỉ tồn tại lúc compile-time, biến mất sau khi transpile sang JS (không tốn runtime cost).
- Có thể **declaration merging** — khai báo cùng tên nhiều lần sẽ tự gộp lại:
```ts
interface Pokemon { hp: number }
interface Pokemon { attack: number }
// Pokemon giờ có cả id, name, types, hp, attack
```
- Chỉ dùng để mô tả object shape / class shape, không mô tả union, tuple phức tạp, hay primitive alias.

**`type`** — linh hoạt hơn, alias cho bất kỳ kiểu nào

```ts
type Pokemon = {
  id: number;
  name: string;
  types: string[];
};

type PokemonType = 'fire' | 'water' | 'grass'; // union
type ID = string | number;                      // alias
```
- Cũng biến mất sau compile, không tốn runtime.
- Làm được nhiều thứ `interface` không làm được: union types, tuple, mapped types, conditional types.
- **Không** merge được — khai báo trùng tên sẽ báo lỗi.

Khi chỉ cần mô tả shape của object/data (như response API Pokemon), 2 cái gần như tương đương — chọn cái nào cũng được, nhưng convention phổ biến là dùng `interface` cho object/data shape, `type` cho union/alias phức tạp.

**`class`** — có runtime thực sự

```ts
class Pokemon {
  constructor(public id: number, public name: string) {}

  cry() {
    console.log(`${this.name} says hi!`);
  }
}

const pikachu = new Pokemon(25, 'Pikachu');
```
- Khác biệt lớn nhất: `class` **tồn tại ở runtime**, tạo ra object thật qua `new`, có thể chứa method, constructor, implement logic thật.
- Dùng khi data cần có hành vi (methods) đi kèm, không chỉ là cấu trúc thuần túy.
- Tốn thêm bộ nhớ/runtime overhead so với interface/type.

**Khi nào dùng gì** (áp dụng cho app Pokemon):
- Data từ PokeAPI trả về (JSON thuần, không có method) → dùng `interface` hoặc `type`.
- Chỉ cần `class` nếu muốn gắn logic/method vào object đó (ví dụ `pokemon.isLegendary()`), điều mà trong React thường không cần vì component xử lý logic thay.

### Object shape, class shape, union, tuple, primitive alias

**1. Object shape** — mô tả cấu trúc của một object: có những field nào, kiểu gì.
```ts
interface Pokemon {
  id: number;
  name: string;
  isLegendary: boolean;
}

const bulbasaur: Pokemon = {
  id: 1,
  name: 'Bulbasaur',
  isLegendary: false,
};
```

**2. Class shape** — `interface` mô tả "hợp đồng" mà một `class` phải tuân theo (implement), tức class đó phải có đủ property/method như interface định nghĩa.
```ts
interface Movable {
  speed: number;
  move(): void;
}

class Pokemon implements Movable {
  speed = 10;
  move() {
    console.log('running...');
  }
}
```
`interface` ở đây định nghĩa "shape" mà class phải khớp, chứ bản thân interface không chạy được ở runtime.

**3. Union** — một giá trị có thể là một trong nhiều kiểu được liệt kê, nối bằng `|`.
```ts
type PokemonType = 'fire' | 'water' | 'grass' | 'electric';

let myType: PokemonType = 'fire'; // OK
myType = 'poison'; // Lỗi — không nằm trong union

type ApiResult =
  | { status: 'success'; data: Pokemon }
  | { status: 'error'; message: string };

function handle(result: ApiResult) {
  if (result.status === 'success') {
    console.log(result.data.name); // TS biết chắc có `data` ở đây
  } else {
    console.log(result.message); // TS biết chắc có `message` ở đây
  }
}
```
`interface` không thể làm được việc này — không có cú pháp `interface X = A | B`.

**4. Tuple (phức tạp)** — mảng có số lượng phần tử cố định và kiểu của từng vị trí được quy định riêng (khác `array` thường vốn chỉ có 1 kiểu lặp lại).
```ts
// Tuple đơn giản
type Coordinate = [number, number]; // [x, y]
const point: Coordinate = [10, 20];

// Tuple phức tạp: nhiều kiểu khác nhau, có phần tử optional, có label
type PokemonStat = [name: string, value: number, isMaxed?: boolean];

const hp: PokemonStat = ['HP', 100, true];
const atk: PokemonStat = ['Attack', 80]; // isMaxed optional nên bỏ qua được

// So sánh với array thường — không ràng buộc vị trí/kiểu từng phần tử
const arr: (string | number)[] = ['HP', 100, 'Attack', 80]; // lỏng lẻo hơn nhiều
```
`interface` không mô tả được tuple — chỉ `type` làm được.

**5. Primitive alias** — đặt tên khác (alias) cho một kiểu primitive có sẵn (`string`, `number`, `boolean`...) để code rõ nghĩa hơn.
```ts
type PokemonId = number;
type PokemonName = string;

function getPokemon(id: PokemonId): PokemonName {
  return 'Pikachu';
}

// Không thể viết interface cho việc này:
// interface PokemonId = number;  ❌ lỗi cú pháp
```
`PokemonId` vẫn chỉ là `number` khi compile, nhưng giúp đọc code dễ hiểu hơn (self-documenting).

**Tóm gọn**: `interface` chỉ giỏi ở việc mô tả "object có field gì" hoặc "class phải implement gì". Còn union, tuple, primitive alias đều cần `type` vì chúng không phải là "object có field" — mà là các kiểu dữ liệu khác cấu trúc hoàn toàn.
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
