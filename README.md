### Перед началом работы

1. Убедитесь что у вас установлен `node`, `pnpm` и `docker`
2. Выполните команду `pnpm -v` - если команда возвращает номер, то pnpm у Вас установлен.
3. Выполните команду `pnpm bootstrap` - это обязательный шаг, без него ничего работать не будет :)

### Запуск проекта в режиме разработки

- Выполните команду `pnpm dev` чтобы запустить и фронтенд и бекенд в режиме разработки
- Выполните команду `pnpm dev --scope=client` чтобы запустить только клиент
- Выполните команду `pnpm dev --scope=server` чтобы запустить только server

### Как добавить зависимости?

В этом проекте используется `monorepo` на основе [`lerna`](https://github.com/lerna/lerna)

Чтобы добавить зависимость для клиента
`pnpm --filter client i {your_dep}`

Для сервера
`pnpm --filter server i {your_dep}`

И для клиента и для сервера
`yarn lerna add {your_dep}`

Если вы хотите добавить dev зависимость, проделайте то же самое, но с флагом `dev`
для фронтенда:
`pnpm --filter client i -D {your_dep}`
для бекенда:
`pnpm --filter server i -D {your_dep}`

### Тесты

Для клиента используется [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/)

`pnpm test`

### Линтинг

`pnpm lint`

### Форматирование prettier

`pnpm format`

### Production build

`pnpm build`

И чтобы посмотреть что получилось

`pnpm preview --scope client`
`pnpm preview --scope server`

## Хуки

В проекте используется [lefthook](https://github.com/evilmartians/lefthook)
Если очень-очень нужно пропустить проверки, используйте `--no-verify` (но не злоупотребляйте :)

## Ой, ничего не работает :(

Откройте issue, я приду :)

## Автодеплой статики на vercel

Зарегистрируйте аккаунт на [vercel](https://vercel.com/)
Следуйте [инструкции](https://vitejs.dev/guide/static-deploy.html#vercel-for-git)
В качестве `root directory` укажите `packages/client`

Все ваши PR будут автоматически деплоиться на vercel. URL вам предоставит деплоящий бот

## Production окружение в докере

Перед первым запуском выполните `node init.mjs`

`docker compose up` - запустит три сервиса

1. nginx, раздающий клиентскую статику (client)
2. node, ваш сервер (server)
3. postgres, вашу базу данных (postgres)

Если вам понадобится только один сервис, просто уточните какой в команде
`docker compose up {sevice_name}`, например `docker compose up server`

## Netlify deploy

Посмотреть как выглядит приложение можно [здесь](https://startling-bienenstitch-c29e13.netlify.app/).

## Оперативная память и JS
Hello there! Как ви уже знаете, **работа с памятью в JS(TS) реализована неявно**. Это подается как *фича* языка. 

Несмотря на это, явная типизация переменных в TypeScript сделала язык лучше, написание кода программистами - проще, особенно учитывая интересное и не всегда очевидное приведение типов в JS, например 

`const a = {}; //!!a = true`

JS впитал почти все самые плохие практики и продолжает мужественно тащить их за собой. Штош. 
Безусловно с появлением рантайм-движков типа node.js javascript вышел за рамки браузера и становится на одну ступень с такими высокоуровневыми ЯП как C или Python, *ну почти*. Дальше речь пойдет про веб.

Ситуация усугубляется еще и тем, что стандарты языка, например ECMAScript 5 или ECMAScript 6 только *описывают* как код должен быть скомпилирован. Конкретная имплементация зависит от движка, например движка браузера, т.к. основное использование JS это все-таки веб.

Но все же разные разработчики движков для браузеров по-разному интерпретируют стандарты, и разработчик **ожидает** что результат работы программы будет одинаковым. Однако один и тот же код запущенный например в IE7, который использует движок Chakra и в последнем релизе Chrome, который использует движок V8 будут *немного различными*.
Поэтому ниженаписанное будет различаться от движка к движку, но в целом справедливо для V8 js engine.

### Что именно в JS можно реализовать лучше? 
С точки зрения работы с памятью это конечно же сборщик мусора(Далее GC - garbage collector). 
Это блокирующий механизм(набор функций), который самопроизвольно запускается в основном потоке и блокирует(!) выполнение кода в main thread. 

При этом разработчик не может вызвать GC самостоятельно или пропустить его вызов. Это плата за динамическое и неявное выделение памяти. 

Интересно что память в JS выделяется на моменте декларации, а не инициализации. Т.е. когда вы пишете

`let somevar; // undefined`

память **уже** выделена, и переменная имеет значение undefined. 

**В JS память хранится в stack и в heap**. На русском это может быть как "стопка" и "куча", но тем не менее, лучше использовать оригинальные термины, несмотря на любовь яндекса к ужасным вещам типа "ручек" вместо handlers. 
В stack лежат переменные примитивных типов и ссылки на объекты. Stack это место где хранятся переменные с **фиксированным размером памяти.**

Например integer занимает 8 байт, а boolean(внезапно!) от 4-8 байт, вместо одного байта. JS полон чудес :0

Все что не является примитивным типом, хранится в memory heap, однако это не совсем верно. В memory stack лежит ссылка на сам объект(typeof Symbol), а сам объект хранится в heap.
Еще одно *блестящее* решение. Хотя на моменте зарождения веба это было неочевидно и никто не знал как будут дальше развиваться веб-приложения.

Память в memory heap выделяется динамически, там же лежат инстансы классов, функции, массивы и вся рожь, т.е. все что является истинным объектом.

Движок JS делает много чего под капотом, но весь код после транспиляции в байт-код и компиляции выполняется в main thread, в основном потоке. JS - это **синхронный ЯП**, т.е. каждая операция в call stack является **блокирующей** и выполняется **синхронно**.
```
function first() {
    console.log("1");
}
function second() {
    console.log("2");
};

first();
second();

// 1
// 2
```

Сначала вызывается функция first(); и пока она не закочит работу, функция second(); не будет вызвана.

Вот на этапе сборки мусора в memory heap и начинаются проблемы. 

Сборщик мусора просто блокирует выполнение программы и начинает проход по memory heap, что бы найти области памяти, на которые никто не ссылается, или те области, которые *недоступны*(unreachable)

Это основной принцип механизма сборщика мусора в JS. Определить, какие области памяти недоступны и освободить эту память.

Это текущий скоуп, все переменные в нем, все функции внутри текущего контекста, и т.д. Грубо говоря это 
**все что мы вызываем прямо сейчас или вызовем в результате исполнения текущего кода + глобальные переменные + все объекты на которые мы явно ссылаемся**

### Утечки памяти 
Какие проблемы были конкретно в этом проекте?

Сама игра представляет собой цикличный вызов функции TDEngine.gameLoop(); которая в каждом кадре отрисовывает текущие сущности движка(враги, снаряды, башни, спеллы) и считает новые координаты.

```
public gameLoop = () => {
    const timeout = setTimeout(() => {
        ...
        ...
        ...
      clearTimeout(timeout);
    }, 1000 / this.initialGameParams.fps);
```
Мякотка в том, что мы жестко задаем частоту кадров(FPS), потому что количество кадров в спрайте ограничено, и браузер будет сам рассчитывать FPS так быстро, как у него это получится(внутри gameLoop вызывается requestAnimationFrame())

Как вы могли заметить выше, каждый вызов функции gameLoop мы устанавливаем таймер и очищаем его же(setTimeout && clearTimeout), **в каждом тике(кадре) игры**
При этом таймеры это не часть стандарта ECMAScript, и каждый движок реализует их так, как хотят авторы :0 

По сути таймер - это просто ссылка на функцию, которую надо выполнить через определенный интервал. setInterval() и setTimeout() по сути одно и то же, разница в том чколько раз будет вызвана функция, с точки зрения языка таймер и таймаут это одно и то же.
В main thread переодически происходит вызов функции, которая проходит все таймеры и проверяет, не пора ли их запустить. Именно поэтому таймер в JS нельзя поставить на паузу, такого механизма просто не существует.

Так вот, при вызове setTimeout() мы получаем в return ID таймера, который будет лежать в памяти **ДО ТЕХ ПОР, ПОКА МЫ ЯВНО НЕ ОЧИСТИМ ЭТОТ ИНТЕРВАЛ И НЕ УСТАНОВИМ ПЕРЕМЕННУЮ В NULL**!

Основные утечки памяти и связаны с тем, что мы явно не очищали таймеры, и функции, на которые ссылался таймер продолжали висеть в памяти. 

Так было например в таймауте выстрела башни, на каждый кадр добавлялся новый таймер проверки готовности к выстрелу, что за минуту раздувало размер heap до 20 мб.

Сборщик мусора каждый раз проходил бОльший объем памяти в memory heap и так продолжалось пока приложение не сжирало всю доступную память и не вешало вкладку\браузер.

Теперь все таймеры явно очищаются и игра имеет приемлимую производительность.

### Что было сделано еще для оптимизации
1. Стопка из canvas в DOM. Сейчас это стопка из 16(!) прозрачных канвасов, подложенных один под другой в определенном порядке. 
Это позволяет рисовать одни объекты над другими(башни над врагами, снаряды над башнями и т.д.) и позволяет распараллелить тяжелые вычисления(потому что JS это синхронный язык).

Частично проблему могли бы решить веб-воркеры, но метод со стопкой оказался самым эффективным.

2. Перерисовывается(стирается и отрисовывается заново) только то, что действительно нужно. 
Если на карте нету врагов - не нужно перерисовывать канвас с врагами и пульками. Если нету заклинаний - их тоже рисовать не нужно.

3. Оптимизация физики движка.
Очень затратно вычисление вектора до цели и проверка нахождения цели в радиусе действия. Потому что там возведение в степерь и квадратный корень(что тоже есть возведение в степень, но все же).
Поэтому пришлось грубо проверять рядом ли с башней враг, и только потом проверять находится ли он в радиусе атаки башни.

Аналогично и с физикой снарядов, это самые ресурсоемкие вычисления, число снарядов > числа башен. Поэтому класс Projectile самый легкий и максимально оптимизированный, он наследует все что может от башни, которая этот снаряд выпустила.

4. Жесткий FPS. Из-за механики анимации спрайтов и из-за жестких рамок по производительности. Это примерно 16 миллисекунд на кадр, плюс минус. Движку браузера проще работать, когда от него не требуется давать кадр быстрее.
