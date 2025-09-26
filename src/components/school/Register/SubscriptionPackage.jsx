import React from "react";

const SubscriptionPackage = ({
  formData,
  formErrors,
  handleChange,
  products,
  productLoading,
}) => {
  
  return (
    <div className="border-b border-gray-900/10 pb-6">
      <h3 className="text-lg font-semibold leading-7 text-gray-900 text-center">
        2. Pilih Produk/Paket Langganan
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600 text-center">
        Pilih paket langganan yang sesuai untuk sekolah Anda.
      </p>

      <div className="mt-4">
        {productLoading ? (
          <p>Memuat produk...</p>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                value={formData.selected_product_id}
                className={`border rounded-lg p-4 cursor-pointer ${
                  formData.selected_product_id === product.id
                    ? "border-orange-soft-300 ring-2 ring-orange-soft-300"
                    : "border-gray-300"
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: "selected_product_id", value: product.id },
                  })
                }
              >
                <h4 className="font-semibold text-lg">{product.name}</h4>
                <p className="text-gray-600 text-left">
                  Durasi: {product.duration} bulan
                </p>
                <p className="text-xl font-bold text-orange-soft text-left">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
                <p className="text-gray-600 text-left">Fitur:</p>
                <ul className="mt-2 text-sm text-gray-700 list-disc pl-6">
                  {product.features?.length > 0 ? (
                    product.features.map((feature, index) => (
                      <li key={index}>{feature.name}</li>
                    ))
                  ) : (
                    <li className="list-none text-gray-500">
                      Tidak ada fitur tersedia.
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>Tidak ada produk/paket langganan tersedia.</p>
        )}
        {formErrors.selected_product_id && (
          <p className="form-error mt-2">{formErrors.selected_product_id}</p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPackage;
