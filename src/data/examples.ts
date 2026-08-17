export interface ExampleCode {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  code: string;
  category: string;
}

export const exampleCodes: ExampleCode[] = [
  {
    id: 'hello',
    titleAr: 'مرحباً بالعالم',
    titleEn: 'Hello World',
    descriptionAr: 'أول برنامج بايثون - طباعة نص على الشاشة',
    category: 'أساسيات',
    code: `# أول برنامج في بايثون
print("مرحباً بالعالم!")
print("أهلاً بك في لغة بايثون")`
  },
  {
    id: 'variables',
    titleAr: 'المتغيرات وأنواع البيانات',
    titleEn: 'Variables & Data Types',
    descriptionAr: 'تعلم كيفية إنشاء المتغيرات واستخدام أنواع البيانات المختلفة',
    category: 'أساسيات',
    code: `# تعريف متغيرات من أنواع مختلفة
name = "أحمد"
age = 25
height = 1.75
is_student = True

print(name)
print(age)
print(height)`
  },
  {
    id: 'arithmetic',
    titleAr: 'العمليات الحسابية',
    titleEn: 'Arithmetic Operations',
    descriptionAr: 'جمع، طرح، ضرب، قسمة و باقي القسمة',
    category: 'أساسيات',
    code: `a = 10
b = 3

# عمليات حسابية
sum_result = a + b
diff = a - b
product = a * b
quotient = a / b
floor_div = a // b
remainder = a % b

print(sum_result)
print(product)
print(quotient)`
  },
  {
    id: 'if_else',
    titleAr: 'الشرط if/else',
    titleEn: 'If/Else Conditions',
    descriptionAr: 'اتخاذ قرارات في الكود بناءً على شروط',
    category: 'الشروط',
    code: `age = 18

# التحقق من العمر
if age >= 18:
    print("أنت بالغ")
else:
    print("أنت قاصر")

# شروط متعددة
score = 85

if score >= 90:
    print("ممتاز")
elif score >= 75:
    print("جيد جداً")
elif score >= 60:
    print("جيد")
else:
    print("راسب")`
  },
  {
    id: 'for_loop',
    titleAr: 'حلقة for',
    titleEn: 'For Loop',
    descriptionAr: 'التكرار على مجموعة من القيم',
    category: 'الحلقات',
    code: `# حلقة for مع range
for i in range(5):
    print(i)

# تكرار على قائمة
fruits = ["تفاح", "موز", "برتقال"]
for fruit in fruits:
    print(fruit)`
  },
  {
    id: 'while_loop',
    titleAr: 'حلقة while',
    titleEn: 'While Loop',
    descriptionAr: 'التكرار طالما الشرط صحيح',
    category: 'الحلقات',
    code: `# عداد تنازلي
countdown = 5

while countdown > 0:
    print(countdown)
    countdown = countdown - 1

print("انطلق!")`
  },
  {
    id: 'functions',
    titleAr: 'الدوال',
    titleEn: 'Functions',
    descriptionAr: 'إنشاء دوال قابلة لإعادة الاستخدام',
    category: 'الدوال',
    code: `# تعريف دالة
def greet(name):
    message = "مرحباً " + name
    print(message)

# استدعاء الدالة
greet("أحمد")
greet("سارة")

# دالة تُرجع قيمة
def add(a, b):
    result = a + b
    return result

answer = add(5, 3)
print(answer)`
  },
  {
    id: 'lists',
    titleAr: 'القوائم',
    titleEn: 'Lists',
    descriptionAr: 'التعامل مع القوائم والتعامل مع عناصرها',
    category: 'البنى البيانات',
    code: `# إنشاء قائمة
numbers = [1, 2, 3, 4, 5]

# إضافة عنصر
numbers.append(6)

# طول القائمة
length = len(numbers)
print(length)

# الوصول لعنصر
first = numbers[0]
print(first)

# تكرار على القائمة
for num in numbers:
    print(num * 2)`
  },
  {
    id: 'strings',
    titleAr: 'النصوص',
    titleEn: 'Strings',
    descriptionAr: 'التعامل مع النصوص والسلاسل',
    category: 'أساسيات',
    code: `# عمليات على النصوص
name = "أحمد"
message = "مرحباً"

# دمج نصوص
greeting = message + " " + name
print(greeting)

# طول النص
length = len(name)
print(length)

# تحويل حالة النص
text = "hello world"
upper_text = text.upper()
print(upper_text)`
  },
  {
    id: 'calculator',
    titleAr: 'آلة حاسبة بسيطة',
    titleEn: 'Simple Calculator',
    descriptionAr: 'برنامج آلة حاسبة يجمع عدة مفاهيم',
    category: 'مشاريع',
    code: `# آلة حاسبة بسيطة
def calculator(a, b, operation):
    if operation == "+":
        result = a + b
    elif operation == "-":
        result = a - b
    elif operation == "*":
        result = a * b
    elif operation == "/":
        result = a / b
    else:
        result = 0
    return result

answer = calculator(10, 5, "+")
print(answer)

answer = calculator(10, 3, "/")
print(answer)`
  },
];
