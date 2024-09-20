import pandas as pd
from faker import Faker
import random
import os

fake = Faker("vi_VN")  # 'vi_VN' cho dữ liệu giả Việt Nam

# Đọc file Excel hiện có
df = pd.read_excel("dataTempalte.xlsx")

def generate_vietnamese_phone_number():
    prefixes = ['03', '07', '08', '09']
    prefix = random.choice(prefixes)
    number = ''.join(random.choices('0123456789', k=8))
    return prefix + number

vietnamese_addresses = [
    "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
    "Bắc Ninh", "Bình Dương", "Đồng Nai", "Khánh Hòa", "Lâm Đồng",
    "Quảng Ninh", "Thanh Hóa", "Nghệ An", "Thừa Thiên Huế", "Quảng Nam",
    "Bình Thuận", "Bà Rịa - Vũng Tàu", "Bình Phước", "Bình Định", "Cà Mau",
    "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Tháp", "Gia Lai",
    "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang",
    "Hòa Bình", "Hưng Yên", "Kiên Giang", "Kon Tum", "Lai Châu",
    "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Ninh Bình",
    "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Ngãi",
    "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình",
    "Thái Nguyên", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long",
    "Vĩnh Phúc", "Yên Bái", "An Giang", "Bạc Liêu", "Bắc Giang",
    "Bắc Kạn", "Bến Tre", "Cao Bằng"
]

def generate_vietnamese_address():
    return random.choice(vietnamese_addresses)

def generate_formatted_dob(minimum_age=18, maximum_age=25):
    dob = fake.date_of_birth(minimum_age=minimum_age, maximum_age=maximum_age)
    return dob.strftime("%m/%d/%Y")

def generate_past_date():
    past_date = fake.past_date()
    return past_date.strftime("%m/%d/%Y")

def generate_formatted_dob_parent(minimum_age=30, maximum_age=70):
    dob = fake.date_of_birth(minimum_age=minimum_age, maximum_age=maximum_age)
    return dob.strftime("%m/%d/%Y")


def create_fake_student():
    cha = fake.random_element(elements=("Có", "Không"))
    me = fake.random_element(elements=("Có", "Không"))

    # Xác định giá trị cho "Quan hệ khác" dựa trên Cha và Mẹ
    if cha == "Không" and me == "Không":
        quan_he_khac = fake.random_element(elements=("Ông bà", "Anh chị", "Họ hàng"))
    else:
        quan_he_khac = "Không"
    return {
            "Họ và tên": fake.name(),
            "Năm sinh": generate_formatted_dob(),
            "Giới tính": fake.random_element(elements=("Nam", "Nữ")),
            "Dân tộc": fake.random_element(
                elements=(
                    "Kinh",
                    "Tày",
                    "Mường",
                    "Thái",
                    "Khmer",
                    "Hoa",
                    "Nùng",
                    "HMông",
                    "Dao",
                    "Gia Rai",
                    "Ê Đê",
                    "Ba Na",
                    "Xơ Đăng",
                    "Sán Chay",
                    "Chăm",
                    "Cơ Ho",
                    "Xtiêng",
                    "Giáy",
                    "Hrê",
                    "Ra Glai",
                    "M nông",
                    "Thổ",
                    "Chu Ru",
                    "Lào",
                    "La Chí",
                    "La Ha",
                    "Pu Péo",
                    "Brâu",
                    "Ơ Đu",
                    "Ngái",
                    "Si La",
                    "Pu Ko",
                    "Rơ Măm",
                    "La Hu",
                    "Lô Lô",
                    "Chứt",
                    "Mảng",
                    "Cờ Lao",
                    "Bố Y",
                    "La Chi",
                    "Phù Lá",
                    "La Hủ",
                    "Khơ Mú",
                    "Pà Thẻn",
                    "Cống",
                    "Brau",
                    "Ro Mam",
                    "Ơ Đu",
                    "Hoa",
                    "Ngái",
                    "Si La",
                    "Pu Ko",
                    "Rơ Măm",
                    "La Hu",
                    "Lô Lô",
                    "Chứt",
                    "Mảng",
                    "Cờ Lao",
                    "Bố Y",
                    "La Chi",
                    "Phù Lá",
                    "La Hủ",
                    "Khơ Mú",
                    "Pà Thẻn",
                    "Cống",
                    "Brau",
                    "Ro Mam",
                    "Ơ Đu",
                    "Hoa",
                    "Ngái",
                    "Si La",
                    "Pu Ko",
                    "Rơ Măm",
                    "La Hu",
                    "Lô Lô",
                    "Chứt",
                    "Mảng",
                    "Cờ Lao",
                    "Bố Y",
                    "La Chi",
                )
            ),
            "Ngày vào trường": generate_past_date(),
            'Số điện thoại': generate_vietnamese_phone_number(),
            "Địa chỉ": generate_vietnamese_address(),
            "Trạng thái": fake.random_element(
                elements=("Đang học", "Nghỉ học", "Thôi học")
            ),
            "Cha": cha,
            "Mẹ": me,
            "Quan hệ khác": quan_he_khac,
            "Họ tên cha": (
                fake.name()
                if cha == "Có"
                else None
            ),
            "Năm sinh cha": (
                generate_formatted_dob_parent()
                if cha == "Có"
                else None
            ),
            "Số điện thoại cha": (
               generate_vietnamese_phone_number()
                if cha == "Có"
                else None
            ),
            "Nghề nghiệp cha": (
                fake.job()
                if cha == "Có"
                else None
            ),
            "Họ tên mẹ": (
                fake.name()
                if me == "Có"
                else None
            ),
            "Năm sinh mẹ": (
                generate_formatted_dob_parent()
                if me == "Có"
                else None
            ),
            "Số điện thoại mẹ": (
                generate_vietnamese_phone_number()
                if me == "Có"
                else None
            ),
            "Nghề nghiệp mẹ": (
                fake.job()
                if me == "Có"
                else None
            ),
            "Họ tên quan hệ khác": (
                fake.name()
                if quan_he_khac != "Không"
                else None
            ),
            "Năm sinh quan hệ khác": (
                generate_formatted_dob_parent()
                if quan_he_khac != "Không"
                else None
            ),
            "Số điện thoại quan hệ khác": (
                generate_vietnamese_phone_number()
                if quan_he_khac != "Không"
                else None
            ),
            "Nghề nghiệp quan hệ khác": (
                fake.job()
                if quan_he_khac != "Không"
                else None
            ),
            "Năm học": "2024-2025",
            "Khối": "1",
            "Lớp": "1A2",
        }

fake_students = [create_fake_student() for _ in range(40)]

df_fake = pd.DataFrame(fake_students)

df_combined = pd.concat([df, df_fake], ignore_index=True)

if 'student_info_with_mockup.xlsx' in os.listdir():
    os.remove('student_info_with_mockup.xlsx')

df_combined.to_excel('student_info_with_mockup.xlsx', index=False)

print("Đã thêm sinh viên giả thành công!")
