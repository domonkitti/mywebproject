export default function Form004_1() {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-center font-bold text-lg">แบบข้อมูลพื้นฐานของงาน</h2>
        <p className="text-center text-sm">(สนับสนุนเพื่อการดำเนินงานปกติ)</p>
  
        {/* 1. ชื่อหน่วยงาน */}
        <div className="mt-4">
          <label className="block font-medium">1. ชื่อ</label>
          <input type="text" className="input-field w-full mt-1" />
        </div>
  
        {/* 2. รายละเอียดของงาน */}
        <div className="mt-4">
          <label className="block font-medium">2. รายละเอียดของงาน/แผนงาน</label>
          <div className="ml-4 mt-2">
            <label className="block font-medium">2.1 ผู้รับผิดชอบ</label>
            <div className="flex space-x-2">
              <span>แผนก</span>
              <input type="text" className="input-field w-32"placeholder="ทำ dropdown" />
              <span>กอง</span>
              <input type="text" className="input-field w-32"placeholder="ทำ dropdown" />
              <span>ฝ่าย</span>
              <input type="text" className="input-field w-32"placeholder="ทำ dropdown" />
            </div>
            <div className="mt-2">
              <span>สายงาน</span>
              <input type="text" className="input-field w-full mt-1"placeholder="ทำ dropdown" />
            </div>
          </div>
        </div>
  
        {/* 2.2 ความจำเป็นในการดำเนินงาน */}
        <div className="mt-4">
          <label className="block font-medium">2.2 ความจำเป็นในการดำเนินงาน(จะเป็นแบบนี้ไปทุกปีไหม?)</label>
          <div className="ml-4 space-y-1">
            <div>
              <input type="checkbox" /> มีสัญญา ข้อผูกพัน หรือมีเงื่อนไขที่ต้องดำเนินการ
            </div>
            <div>
              <input type="checkbox" /> นโยบายสำคัญของรัฐบาล
            </div>
            <div>
              <input type="checkbox" /> นโยบายสำคัญของ กฟภ.
            </div>
            <div>
              <input type="checkbox" /> อื่นๆ <input type="text" className="input-field w-40" />
            </div>
          </div>
        </div>
  
        {/* 2.3 แผนการทำงาน */}
        <div className="mt-4">
          <label className="block font-medium">2.3 ประเภทการลงทุน(ประเภทจะใช้แบบนี้ไหม)</label>
          <div className="ml-4 space-y-1">
            <div>
              <input type="checkbox" /> งานก่อสร้าง ขยายเขตและปรับปรุงระบบจำหน่าย
            </div>
            <div>
              <input type="checkbox" />งานติดตั้งระบบศูนย์สั่งการจ่ายไฟ
            </div>
            <div>
              <input type="checkbox" /> งานจัดหาที่ดิน อาคาร ยานพาหนะ และ เครื่องมือเครื่องใช้ต่างๆ
            </div>
            <div>
              <input type="checkbox" /> งานบำรุงรักษาด้านระบบไฟฟ้า
            </div>
            <div>
              <input type="checkbox" /> งานIT
            </div>
            <div>
              <input type="checkbox" /> งานพัฒนาระบบสื่อสาร
            </div>
          </div>
        </div>
  
        {/* 2.4 สถานะของงาน */}
        <div className="mt-4">
          <label className="block font-medium">2.4 สถานะของงาน</label>
          <div className="ml-4">
          <input type="checkbox" /> งานต่อเนื่อง<br />(อันนี้ต้องพิจารณาว่าจะให้เขาไปแก้ไขของเดิมหรือให้เขาทำใหม่ตรงนี้เลย)<br />
          <input type="checkbox" /> งานใหม่
          </div>
        </div>
  
        {/* 2.5 หน่วยปฏิบัติ */}
        <div className="mt-4">
          <label className="block font-medium">2.5 สถานะการอนุมัติ</label>
          <div className="ml-4 space-y-1">
            <div>
              <input type="checkbox" /> ผวก. ลงนาม วันที่ ............
            </div>
            <div>
              <input type="checkbox" /> คณะกรรมการ กฟภ. วันที่ ...........
            </div>
            <div>
              <input type="checkbox" /> คณะรัฐมนตรี วันที่ .............
            </div>
          </div>
        </div>
  
        {/* 2.6 ระยะเวลาการดำเนินการ */}
        <div className="flex items-center space-x-6">
            <span>ปีเริ่มต้น</span>
            <input 
                type="text" 
                className="input-field w-16 h-8 p-1 text-center border border-gray-300 rounded-md"
                placeholder="25xx"
            />

            <span>ปีสิ้นสุด</span>
            <input 
                type="text" 
                className="input-field w-16 h-8 p-1 text-center border border-gray-300 rounded-md"
                placeholder="25xx"
            />
        </div>
  
        {/* 2.7 งบสนับสนุนที่ขอรับ */}
        <div className="mt-4">
          <label className="block font-medium">2.6 วงเงิน</label>
          <div className="ml-4 space-y-2">
            <div>
              <span> วงเงินลงทุนทั้งสิ้น ของงาน/แผนงาน </span>
              <input type="text" className="input-field w-16 h-8 p-1 text-center border border-gray-300 rounded-md" /> บาท
            </div>
            <div>
              <span>วงเงินลงทุนปี 2569 ของงาน/แผนงาน</span>
              <input type="text" className="input-field w-16 h-8 p-1 text-center border border-gray-300 rounded-md" /> บาท
            </div>
            <div>
              <span>เป้าหมายการเบิกจ่ายงบลงทุนปี 2569</span>
              <input type="text" className="input-field w-16 h-8 p-1 text-center border border-gray-300 rounded-md" /> บาท
            </div>
            <div>
              <span>วงเงิน งบทำการ ที่ขอตั้งในปี 2569 (ถ้ามี)</span>
              <input type="text" className="input-field w-16 h-8 p-1 text-center border border-gray-300 rounded-md" /> บาท
            </div>
          </div>
        </div>
  
        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg">
            บันทึกข้อมูล
          </button>
        </div>
      </div>
    );
  }
  