import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import Image from 'next/image'
import React from 'react'

const TypePage = () => {
  return (
    <div className="container">
      <div className='mb-4 text-2xl'>
        <h2>Bạn đang kêu gọi gây quỹ cho đối tượng nào?</h2>
      </div>
      <div className="w-full">
        <ToggleGroup type="single" className="w-full flex flex-col gap-4">
          <ToggleGroupItem  className="w-full border rounded-2xl hover:bg-primary/10 h-fit p-4 gap-4 flex justify-start" value="youself"  aria-label="category">
            <Image src={"/you-self.png"} width={80} className='rounded-2xl'  height={80} />
            <div className='text-left font-thin'>
              <h3>Bản thân bạn</h3>
              <p className='text-muted-foreground'>Số tiền sẽ được chuyển vào tài khoản ngân hàng của bạn để bạn tự sử dụng.</p>
            </div>
          </ToggleGroupItem>
          <ToggleGroupItem  className="w-full border rounded-2xl hover:bg-primary/10 h-fit p-4 gap-4 flex justify-start" value="someoneelse"  aria-label="category">
            <Image src={"/someone-else.png"} width={80} className='rounded-2xl'  height={80} />
            <div className='text-left font-thin'>
              <h3>Người khác</h3>
              <p className='text-muted-foreground'>Bạn sẽ mời người thụ hưởng nhận quỹ hoặc tự phân phối khoản tiền gây quỹ.</p>
            </div>
          </ToggleGroupItem>
          <ToggleGroupItem  className="w-full border rounded-2xl hover:bg-primary/10 h-fit p-4 gap-4 flex justify-start" value="charity"  aria-label="category">
            <Image src={"/charity.png"} width={80} className='rounded-2xl'  height={80} />
            <div className='text-left font-thin'>
              <h3>Từ thiện</h3>
              <p className='text-muted-foreground'>Số tiền sẽ được chuyển đến tổ chức phi lợi nhuận mà bạn đã chọn thay cho bạn.</p>
            </div>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}

export default TypePage