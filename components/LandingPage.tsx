import { SignInButton } from '@clerk/nextjs'

export default function LandingPage() {
  return (
    <>
      {/* <!-- Hero Section --> */}
      <section className="text-center py-20 bg-secondary-calm">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Ghi Lại Cảm Xúc
          </h1>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Nhận Lời Động Viên
          </h1>
          <p className="text-xl text-text-soft mb-8 max-w-2xl mx-auto">
            Một không gian an toàn và riêng tư, nơi Trí tuệ Nhân tạo đồng hành cùng bạn trên hành trình tự nhận thức và hỗ trợ tinh thần.
          </p>
          <SignInButton>
            <button className="cursor-pointer inline-block bg-primary-calm font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-100 transition duration-300 transform hover:scale-105">
              Bắt Đầu Ghi Chép Ngay
            </button>
          </SignInButton>
        </div>
      </section>

      {/* <!-- Feature Section --> */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Tính Năng Cốt Lõi Được Thiết Kế Cho Bạn</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* <!-- Feature 1: Mood Classification --> */}
            <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 transform hover:scale-[1.02] transition duration-300">
              <div className="text-primary-calm mb-4">
              </div>
              <h3 className="text-xl font-semibold mb-3">Hệ Thống Phân Loại Tâm Trạng</h3>
              <p className="text-text-soft">
                Mỗi ghi chép được AI (Layer 1) phân loại rõ ràng thành Tích cực, Tiêu cực hoặc Trung lập. Điều này giúp bạn dễ dàng theo dõi và hiểu rõ hơn về sự cân bằng cảm xúc của mình.
              </p>
            </div>

            {/* <!-- Feature 2: Journaling & AI Encouragement --> */}
            <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 transform hover:scale-[1.02] transition duration-300">
              <div className="text-primary-calm mb-4">
              </div>
              <h3 className="text-xl font-semibold mb-3">Phản Hồi Đồng Cảm Tức Thì</h3>
              <p className="text-text-soft">
                Sau khi bạn ghi lại cảm xúc, AI (Layer 2) sẽ tự động phân loại tâm trạng và gửi lại lời động viên ấm áp, an ủi hoặc cổ vũ. Phản hồi luôn mang tính hỗ trợ.
              </p>
            </div>

            {/* <!-- Feature 3: Long-Term Analysis --> */}
            <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 transform hover:scale-[1.02] transition duration-300">
              <div className="text-primary-calm mb-4">
              </div>
              <h3 className="text-xl font-semibold mb-3">Phân Tích Xu Hướng Dài Hạn</h3>
              <p className="text-text-soft">
                Xem lại xu hướng cảm xúc (Layer 3). AI sẽ phân tích trong dài hạn và đưa ra lời định hướng giúp bạn cải thiện tinh thần.
              </p>
            </div>

            
          </div>
        </div>
      </section>

      {/* <!-- Safety Section --> */}
      <section id="safety" className="py-16 bg-red-50/50 border-t border-b border-red-200/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-red-600 font-medium">LƯU Ý: Ứng dụng này chỉ là công cụ hỗ trợ và không thay thế được sự can thiệp y tế chuyên nghiệp.</p>
        </div>
      </section>
    </>
  )
}